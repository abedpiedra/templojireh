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

// Quita de MongoDB los videos que ya no existen en YouTube (borrados o
// pasados a privados), que de otro modo quedarían con la miniatura rota.
// Se pregunta por los ids guardados con videos.list: 50 ids por llamada,
// 1 unidad de cuota cada una. Ante cualquier error no se borra nada.
export async function eliminarVideosInexistentes(
  init: RequestInit = { cache: 'no-store' }
): Promise<{ deleted: number }> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return { deleted: 0 }

  const guardados = await YouTubeVideo.find({}, { videoId: 1 }).lean()
  const ids: string[] = guardados.map((video: any) => video.videoId)

  const existentes = new Set<string>()
  for (let i = 0; i < ids.length; i += 50) {
    const lote = ids.slice(i, i + 50)
    const url = `https://www.googleapis.com/youtube/v3/videos?part=id&id=${lote.join(',')}&key=${apiKey}`
    const response = await fetch(url, init)
    const data = await response.json()

    if (!response.ok || data.error || !Array.isArray(data.items)) {
      throw new Error(data.error?.message || 'Respuesta inválida de YouTube')
    }
    for (const item of data.items) existentes.add(item.id)
  }

  const inexistentes = ids.filter((id) => !existentes.has(id))
  if (inexistentes.length === 0) return { deleted: 0 }

  const result = await YouTubeVideo.deleteMany({ videoId: { $in: inexistentes } })
  return { deleted: result.deletedCount || 0 }
}
