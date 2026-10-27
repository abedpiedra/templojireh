import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import YouTubeVideo from '@/lib/models/YouTubeVideo'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UC9-tHryaBdWIBE3o_cM1AsQ' // @TemploJirehTV
// La lista "uploads" del canal: mismo id con prefijo UU en lugar de UC
const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`

// La respuesta se cachea en el servidor: todos los visitantes comparten una
// sola consulta por minuto, sin importar cuántos estén sondeando.
export const revalidate = 60

export async function GET() {
  try {
    await connectDB()

    // Intentar obtener estado en vivo desde YouTube API.
    // playlistItems.list y videos.list cuestan 1 unidad cada uno
    // (search.list costaba 100 y agotaba la cuota diaria en minutos).
    if (YOUTUBE_API_KEY) {
      try {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=10&key=${YOUTUBE_API_KEY}`
        const playlistResponse = await fetch(playlistUrl, { next: { revalidate: 60 } })
        const playlistData = await playlistResponse.json()

        if (playlistData.error) throw new Error(playlistData.error.message)

        const videoIds: string[] = (playlistData.items || []).map(
          (item: any) => item.contentDetails.videoId
        )

        let data: any = { items: [] }
        if (videoIds.length > 0) {
          const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
          const videosResponse = await fetch(videosUrl, { next: { revalidate: 60 } })
          data = await videosResponse.json()
        }

        // Si no hay error de cuota, actualizar caché
        if (!data.error) {
          // Primero, marcar todos los videos como no en vivo
          await YouTubeVideo.updateMany({}, { isLive: false })

          const liveVideo = (data.items || []).find(
            (item: any) => item.snippet.liveBroadcastContent === 'live'
          )

          if (liveVideo) {
            // Guardar/actualizar el video en vivo en MongoDB
            const videoData = {
              videoId: liveVideo.id,
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
              videoId: videoData.videoId,
              title: videoData.title,
              thumbnail: videoData.thumbnail,
              description: videoData.description,
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
