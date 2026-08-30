/**
 * Utilidades para tratar los enlaces de YouTube como contenido propio:
 * el objetivo es poder reproducir dentro del sitio en lugar de enviar
 * a la persona a otra plataforma en cuanto muestra interes.
 */

/** Extrae el id de video desde cualquiera de las formas de URL de YouTube. */
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null

  const patrones = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ]

  for (const patron of patrones) {
    const match = url.match(patron)
    if (match) return match[1]
  }

  return null
}

export function youtubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}
