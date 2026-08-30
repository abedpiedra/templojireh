import { NextResponse } from 'next/server'

/**
 * Publicaciones de la página de Facebook, servidas desde nuestro dominio.
 *
 * El token nunca sale del servidor: el navegador solo recibe los campos
 * que se van a pintar. Si no hay credenciales configuradas se responde
 * `configured: false` y la interfaz cae al plugin oficial.
 */

const API_VERSION = process.env.FACEBOOK_API_VERSION || 'v21.0'
// Graph API cobra por llamada contra el límite de la app: 15 minutos de
// caché es suficiente para una página que publica algunas veces por semana.
const REVALIDAR_SEGUNDOS = 900

export const dynamic = 'force-dynamic'

interface PostGraph {
  id: string
  message?: string
  created_time: string
  permalink_url?: string
  full_picture?: string
  attachments?: {
    data?: { media_type?: string }[]
  }
}

export async function GET() {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN

  if (!pageId || !token) {
    return NextResponse.json({ configured: false, posts: [] })
  }

  const campos = [
    'id',
    'message',
    'created_time',
    'permalink_url',
    'full_picture',
    'attachments{media_type}',
  ].join(',')

  const url =
    `https://graph.facebook.com/${API_VERSION}/${pageId}/posts` +
    `?fields=${encodeURIComponent(campos)}&limit=6&access_token=${encodeURIComponent(token)}`

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDAR_SEGUNDOS } })
    const data = await res.json()

    if (!res.ok) {
      // El mensaje de Graph puede incluir detalles de la app: se registra
      // en el servidor y al cliente solo se le dice que no hay datos.
      console.error('Facebook Graph API:', data?.error?.message || res.status)
      return NextResponse.json({ configured: true, posts: [], error: true })
    }

    const posts = (data.data as PostGraph[] | undefined)?.map((post) => ({
      id: post.id,
      mensaje: post.message || '',
      fecha: post.created_time,
      enlace: post.permalink_url || `https://www.facebook.com/${post.id}`,
      imagen: post.full_picture || null,
      tipo: post.attachments?.data?.[0]?.media_type || null,
    }))

    return NextResponse.json({ configured: true, posts: posts ?? [] })
  } catch (error) {
    console.error('Error consultando Facebook:', error)
    return NextResponse.json({ configured: true, posts: [], error: true })
  }
}
