import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import YouTubeVideo from '@/lib/models/YouTubeVideo'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UC9-tHryaBdWIBE3o_cM1AsQ' // @TemploJirehTV

export const dynamic = 'force-dynamic'

// Función para parsear el feed RSS de YouTube (no usa cuota de API)
async function syncFromRSS(): Promise<{ synced: number; deleted: number; videos: string[] }> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
  const response = await fetch(rssUrl, { cache: 'no-store' })
  const xml = await response.text()

  const videos: string[] = []
  const videoIds: string[] = []
  let synced = 0

  // Extraer videos del XML usando regex
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  const videoIdRegex = /<yt:videoId>([^<]+)<\/yt:videoId>/
  const titleRegex = /<title>([^<]+)<\/title>/
  const publishedRegex = /<published>([^<]+)<\/published>/
  const thumbnailRegex = /<media:thumbnail url="([^"]+)"/
  const descriptionRegex = /<media:description>([^<]*)<\/media:description>/

  let match
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1]

    const videoIdMatch = entry.match(videoIdRegex)
    const titleMatch = entry.match(titleRegex)
    const publishedMatch = entry.match(publishedRegex)
    const thumbnailMatch = entry.match(thumbnailRegex)
    const descriptionMatch = entry.match(descriptionRegex)

    if (videoIdMatch && titleMatch && publishedMatch) {
      const videoData = {
        videoId: videoIdMatch[1],
        title: titleMatch[1],
        description: descriptionMatch ? descriptionMatch[1] : '',
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : `https://i.ytimg.com/vi/${videoIdMatch[1]}/hqdefault.jpg`,
        publishedAt: new Date(publishedMatch[1]),
        isLive: false,
      }

      await YouTubeVideo.findOneAndUpdate(
        { videoId: videoData.videoId },
        videoData,
        { upsert: true, new: true }
      )
      videoIds.push(videoData.videoId)
      videos.push(videoData.title)
      synced++
    }
  }

  // Eliminar videos que ya no están en el RSS (fueron eliminados de YouTube)
  const deleteResult = await YouTubeVideo.deleteMany({
    videoId: { $nin: videoIds }
  })

  return { synced, deleted: deleteResult.deletedCount || 0, videos }
}

// Función para sincronizar usando la API de YouTube (usa cuota)
async function syncFromAPI(): Promise<{ synced: number; quotaError?: boolean }> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('API key not configured')
  }

  let synced = 0
  let pageToken: string | null = null
  const startDate = new Date('2025-01-01T00:00:00Z').toISOString()

  do {
    const searchUrl: string = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=50&publishedAfter=${startDate}${pageToken ? `&pageToken=${pageToken}` : ''}&key=${YOUTUBE_API_KEY}`

    const response: Response = await fetch(searchUrl, { cache: 'no-store' })
    const data = await response.json()

    if (data.error) {
      if (synced > 0) {
        return { synced, quotaError: true }
      }
      throw new Error(data.error.message)
    }

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const videoData = {
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          publishedAt: new Date(item.snippet.publishedAt),
          isLive: item.snippet.liveBroadcastContent === 'live',
        }

        await YouTubeVideo.findOneAndUpdate(
          { videoId: videoData.videoId },
          videoData,
          { upsert: true, new: true }
        )
        synced++
      }
    }

    pageToken = data.nextPageToken || null
  } while (pageToken)

  return { synced }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const source = searchParams.get('source') || 'rss' // 'rss' o 'api'

    if (token !== process.env.SYNC_SECRET_TOKEN && token !== 'manual') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Usar RSS por defecto (no usa cuota)
    if (source === 'rss') {
      const result = await syncFromRSS()
      return NextResponse.json({
        success: true,
        message: `Synced ${result.synced} videos, deleted ${result.deleted} old videos`,
        synced: result.synced,
        deleted: result.deleted,
        source: 'rss'
      })
    }

    // Usar API de YouTube (usa cuota)
    if (source === 'api') {
      const result = await syncFromAPI()
      return NextResponse.json({
        success: true,
        message: `Synced ${result.synced} videos from YouTube API`,
        synced: result.synced,
        source: 'api',
        quotaError: result.quotaError
      })
    }

    return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
  } catch (error) {
    console.error('Error syncing videos:', error)
    return NextResponse.json({ error: 'Error syncing videos' }, { status: 500 })
  }
}

// GET para verificar último sync
export async function GET() {
  try {
    await connectDB()

    const lastVideo = await YouTubeVideo.findOne().sort({ updatedAt: -1 })
    const totalVideos = await YouTubeVideo.countDocuments()

    return NextResponse.json({
      totalVideos,
      lastSync: lastVideo?.updatedAt || null,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error checking sync status' }, { status: 500 })
  }
}
