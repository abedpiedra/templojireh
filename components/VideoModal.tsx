'use client'

import Modal from './Modal'

export interface VideoEnReproduccion {
  id: string
  titulo: string
  /** Enlace original, para quien prefiera verlo en YouTube. */
  url?: string
}

/**
 * Reproduce el sermon dentro del sitio.
 *
 * Antes, cada tarjeta con video era una salida a YouTube: la persona se iba
 * justo en el momento de mayor interes. Aqui se queda, y quien prefiera la
 * plataforma tiene el enlace explicito.
 */
export default function VideoModal({
  video,
  onClose,
}: {
  video: VideoEnReproduccion | null
  onClose: () => void
}) {
  return (
    <Modal open={video !== null} onClose={onClose} title={video?.titulo ?? ''}>
      {video && (
        <>
          <div className="aspect-video overflow-hidden rounded-control bg-black">
            <iframe
              title={video.titulo}
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={video.url || `https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <i className="fab fa-youtube text-red-600"></i> Ver en YouTube
            </a>
            <a
              href="https://www.youtube.com/@TemploJirehTV?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Suscribirse al canal
            </a>
          </div>
        </>
      )}
    </Modal>
  )
}
