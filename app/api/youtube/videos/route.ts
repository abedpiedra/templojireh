import { NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UC9-tHryaBdWIBE3o_cM1AsQ' // @TemploJirehTV

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ videos: [], error: 'API key not configured' })
    }

    // Obtener todos los videos del canal (máximo 50 por página)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=50&key=${YOUTUBE_API_KEY}`

    const response = await fetch(searchUrl, { cache: 'no-store' })
    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const videos = data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
      }))

      return NextResponse.json({ videos })
    }

    return NextResponse.json({ videos: [] })
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return NextResponse.json({ videos: [], error: 'Error fetching videos' })
  }
}
