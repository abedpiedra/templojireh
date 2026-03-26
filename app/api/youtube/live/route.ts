import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import YouTubeVideo from '@/lib/models/YouTubeVideo'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UC9-tHryaBdWIBE3o_cM1AsQ' // @TemploJirehTV

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    // Intentar obtener estado en vivo desde YouTube API
    if (YOUTUBE_API_KEY) {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`

        const response = await fetch(searchUrl, { cache: 'no-store' })
        const data = await response.json()

        // Si no hay error de cuota, actualizar caché
        if (!data.error) {
          // Primero, marcar todos los videos como no en vivo
          await YouTubeVideo.updateMany({}, { isLive: false })

          if (data.items && data.items.length > 0) {
            const liveVideo = data.items[0]

            // Guardar/actualizar el video en vivo en MongoDB
            const videoData = {
              videoId: liveVideo.id.videoId,
              title: liveVideo.snippet.title,
              description: liveVideo.snippet.description,
              thumbnail: liveVideo.snippet.thumbnails.high?.url || liveVideo.snippet.thumbnails.default?.url,
              publishedAt: new Date(liveVideo.snippet.publishedAt),
              isLive: true,
            }

            await YouTubeVideo.findOneAndUpdate(
              { videoId: videoData.videoId },
              videoData,
              { upsert: true, new: true }
            )

            return NextResponse.json({
              isLive: true,
              videoId: liveVideo.id.videoId,
              title: liveVideo.snippet.title,
              thumbnail: videoData.thumbnail,
              description: liveVideo.snippet.description,
            })
          }

          return NextResponse.json({ isLive: false })
        }

        // Si hay error de cuota, continuar al fallback de MongoDB
        console.log('YouTube API error, using cache:', data.error?.message)
      } catch (apiError) {
        console.error('Error calling YouTube API:', apiError)
      }
    }

    // Fallback: buscar en MongoDB si hay algún video marcado como en vivo
    const liveVideo = await YouTubeVideo.findOne({ isLive: true }).lean()

    if (liveVideo) {
      return NextResponse.json({
        isLive: true,
        videoId: (liveVideo as any).videoId,
        title: (liveVideo as any).title,
        thumbnail: (liveVideo as any).thumbnail,
        description: (liveVideo as any).description,
        cached: true,
      })
    }

    return NextResponse.json({ isLive: false })
  } catch (error) {
    console.error('Error checking live status:', error)
    return NextResponse.json({ isLive: false, error: 'Error checking live status' })
  }
}
