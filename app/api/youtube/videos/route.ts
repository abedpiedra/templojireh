import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import YouTubeVideo from '@/lib/models/YouTubeVideo'
import { syncFromRSS } from '@/lib/youtubeSync'

// La respuesta se regenera como máximo cada 15 minutos y en segundo plano:
// en cada regeneración se sincroniza el RSS del canal (no usa cuota), así los
// videos nuevos aparecen solos sin depender de un cron.
const REVALIDAR_SEGUNDOS = 900
export const revalidate = 900

export async function GET() {
  try {
    await connectDB()

    try {
      await syncFromRSS({ next: { revalidate: REVALIDAR_SEGUNDOS } })
    } catch (syncError) {
      // Si YouTube no responde, se sirve lo que ya está en MongoDB
      console.error('Error syncing RSS:', syncError)
    }

    // Obtener videos desde MongoDB (caché)
    const videos = await YouTubeVideo.find({ isLive: false })
      .sort({ publishedAt: -1 })
      .lean()

    const formattedVideos = videos.map((video: any) => ({
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      description: video.description,
      publishedAt: video.publishedAt,
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ videos: [], error: 'Error fetching videos' })
  }
}
