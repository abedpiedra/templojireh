import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import YouTubeVideo from '@/lib/models/YouTubeVideo'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

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
