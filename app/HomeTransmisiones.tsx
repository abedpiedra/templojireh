'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAutoCarrusel } from '@/lib/useAutoCarrusel'
import VideoModal, { type VideoEnReproduccion } from '@/components/VideoModal'

interface Video {
  videoId: string
  title: string
  thumbnail: string
  publishedAt: string
}

/**
 * Las ultimas predicaciones transmitidas, reproducidas dentro del sitio.
 *
 * Es el contenido que hace volver a la gente, y ademas el unico que se
 * publica de forma constante, asi que ocupa un lugar alto en la pagina.
 */
export default function HomeTransmisiones() {
  const [videos, setVideos] = useState<Video[]>([])
  const [cargando, setCargando] = useState(true)
  const [enReproduccion, setEnReproduccion] =
    useState<VideoEnReproduccion | null>(null)
  const { ref, indice, irA } = useAutoCarrusel<HTMLDivElement>({ intervalo: 4000 })

  useEffect(() => {
    let vigente = true

    fetch('/api/youtube/videos')
      .then((res) => res.json())
      .then((data) => {
        if (!vigente) return
        setVideos(Array.isArray(data.videos) ? data.videos.slice(0, 3) : [])
      })
      .catch(() => {
        if (vigente) setVideos([])
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [])

  if (cargando) {
    // Esqueleto con la forma del contenido que viene
    return (
      <div className="snap-row no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:px-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-72 w-full shrink-0 animate-pulse rounded-card bg-ink-quaternary/20 md:w-auto"
          />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="card p-12 text-center">
        <i className="fab fa-youtube mb-4 block text-3xl text-ink-quaternary"></i>
        <p className="type-body text-ink-secondary">
          Las transmisiones aparecerán aquí apenas se publiquen.
        </p>
        <a
          href="https://www.youtube.com/@TemploJirehTV/streams"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-5"
        >
          <i className="fab fa-youtube text-red-600"></i> Ver el canal
        </a>
      </div>
    )
  }

  return (
    <>
      {/* En el teléfono las tarjetas van en fila: apiladas obligaban a
          recorrer tres pantallas para ver lo mismo. La tira avanza sola
          y el dedo puede adelantarla o devolverla en cualquier momento. */}
      <div
        ref={ref}
        className="snap-row no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:px-0"
      >
        {videos.map((video) => (
          <button
            key={video.videoId}
            type="button"
            onClick={() =>
              setEnReproduccion({ id: video.videoId, titulo: video.title })
            }
            // Una tarjeta completa por pantalla: dejar asomar la siguiente
            // la mostraba partida y se leia como un recorte
            className="card card-interactive snap-item w-full shrink-0 text-left md:w-auto"
          >
            <div className="relative h-48 overflow-hidden bg-canvas-sunken">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur">
                <i className="fas fa-play text-xs"></i>
              </span>
            </div>
            <div className="p-5">
              <p className="type-caption text-primary mb-1.5">
                {new Date(video.publishedAt).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <h3 className="type-title-3 text-dark line-clamp-2">
                {video.title}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {/* Posición dentro de la tira, solo donde el carrusel existe */}
      {videos.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 md:hidden">
          {videos.map((video, i) => (
            <button
              key={video.videoId}
              type="button"
              aria-label={`Ver transmisión ${i + 1}`}
              aria-current={i === indice}
              onPointerDown={() => irA(i)}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ease-spring ${
                  i === indice ? 'w-5 bg-primary' : 'w-1.5 bg-ink-quaternary'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/en-vivo" className="btn-ghost">
          Ver todas las transmisiones
        </Link>
      </div>

      <VideoModal
        video={enReproduccion}
        onClose={() => setEnReproduccion(null)}
      />
    </>
  )
}
