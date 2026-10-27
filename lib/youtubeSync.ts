import YouTubeVideo from '@/lib/models/YouTubeVideo'

const CHANNEL_ID = 'UC9-tHryaBdWIBE3o_cM1AsQ' // @TemploJirehTV

// Función para parsear el feed RSS de YouTube (no usa cuota de API)
// Por defecto lee el feed sin caché; quien la llame desde una ruta cacheada
// pasa sus propias opciones para no volver la ruta dinámica.
export async function syncFromRSS(
  init: RequestInit = { cache: 'no-store' }
): Promise<{ synced: number; videos: string[] }> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
  const response = await fetch(rssUrl, init)
  const xml = await response.text()

  const videos: string[] = []
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
        // isLive no se toca: lo administra /api/youtube/live y un video
        // nuevo queda en false por el valor por defecto del modelo
      }

      await YouTubeVideo.findOneAndUpdate(
        { videoId: videoData.videoId },
        videoData,
        { upsert: true, new: true }
      )
      videos.push(videoData.title)
      synced++
    }
  }

  // No se borra nada: el RSS solo trae los ~15 videos más recientes, así que
  // un video ausente del feed no significa que se haya eliminado de YouTube.
  return { synced, videos }
}
