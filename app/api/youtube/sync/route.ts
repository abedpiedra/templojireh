import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import YouTubeVideo from '@/lib/models/YouTubeVideo'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UC9-tHryaBdWIBE3o_cM1AsQ' // @TemploJirehTV

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // Verificar token secreto para proteger el endpoint
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (token !== process.env.SYNC_SECRET_TOKEN && token !== 'manual') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    await connectDB()

    // Obtener videos de YouTube
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=50&key=${YOUTUBE_API_KEY}`

    const response = await fetch(searchUrl, { cache: 'no-store' })
    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ message: 'No videos found', synced: 0 })
    }

    let synced = 0

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

    return NextResponse.json({
      success: true,
      message: `Synced ${synced} videos`,
      synced
    })
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
