import { NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UC9-tHryaBdWIBE3o_cM1AsQ' // @TemploJirehTV

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ isLive: false, error: 'API key not configured' })
    }

    // Buscar transmisiones en vivo del canal
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`

    const response = await fetch(searchUrl, { cache: 'no-store' })
    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const liveVideo = data.items[0]
      return NextResponse.json({
        isLive: true,
        videoId: liveVideo.id.videoId,
        title: liveVideo.snippet.title,
        thumbnail: liveVideo.snippet.thumbnails.high?.url || liveVideo.snippet.thumbnails.default?.url,
        description: liveVideo.snippet.description,
      })
    }

    return NextResponse.json({ isLive: false })
  } catch (error) {
    console.error('Error checking YouTube live:', error)
    return NextResponse.json({ isLive: false, error: 'Error checking live status' })
  }
}
