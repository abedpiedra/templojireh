'use client'

import { useEffect, useRef, useState } from 'react'

const PAGINA = 'https://www.facebook.com/Jirehchurch0498'

interface Publicacion {
  id: string
  mensaje: string
  fecha: string
  enlace: string
  imagen: string | null
}

/**
 * Muro de Facebook con nuestro propio diseño cuando hay credenciales de
 * Graph API, y el plugin oficial como respaldo cuando no las hay.
 *
 * El plugin funciona sin configuración, pero es un iframe de terceros:
 * carga lento, no hereda la tipografía ni los colores del sitio y tiene
 * un ancho máximo de 500 px impuesto por Facebook.
 */
export default function FacebookFeed() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[] | null>(null)
  const [usarPlugin, setUsarPlugin] = useState(false)

  useEffect(() => {
    let vigente = true

    fetch('/api/facebook/posts')
      .then((res) => res.json())
      .then((data) => {
        if (!vigente) return
        const lista: Publicacion[] = Array.isArray(data.posts) ? data.posts : []
        if (!data.configured || lista.length === 0) {
          setUsarPlugin(true)
          return
        }
        setPublicaciones(lista)
      })
      .catch(() => {
        if (vigente) setUsarPlugin(true)
      })

    return () => {
      vigente = false
    }
  }, [])

  if (usarPlugin) {
    return <PluginOficial />
  }

  if (!publicaciones) {
    // Esqueleto con la forma de lo que viene
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-card bg-ink-quaternary/20"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {publicaciones.map((post) => (
        <a
          key={post.id}
          href={post.enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="card card-interactive flex flex-col"
        >
          {post.imagen && (
            <div className="relative h-48 overflow-hidden bg-canvas-sunken">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imagen}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col p-5">
            <p className="type-caption text-primary mb-1.5">
              {new Date(post.fecha).toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="type-footnote text-ink-secondary line-clamp-5 flex-1 whitespace-pre-line">
              {post.mensaje || 'Ver publicación'}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 type-footnote font-semibold text-primary">
              Ver publicación
              <i className="fas fa-arrow-up-right-from-square text-[11px]"></i>
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

/** Respaldo sin configuración: el plugin de página de Facebook. */
function PluginOficial() {
  const contenedor = useRef<HTMLDivElement | null>(null)
  const [ancho, setAncho] = useState<number | null>(null)

  useEffect(() => {
    const el = contenedor.current
    if (!el) return

    // El plugin solo admite entre 180 y 500 px: se mide el contenedor real
    // y se vuelve a medir cuando cambia el tamaño de la ventana.
    const medir = () => {
      const disponible = Math.floor(el.getBoundingClientRect().width)
      setAncho(Math.max(180, Math.min(disponible, 500)))
    }

    medir()
    const observer = new ResizeObserver(medir)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={contenedor} className="mx-auto w-full max-w-[500px]">
      {ancho && (
        <iframe
          title="Publicaciones de Templo Jireh en Facebook"
          src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
            PAGINA,
          )}&tabs=timeline&width=${ancho}&height=560&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false`}
          width={ancho}
          height={560}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          loading="lazy"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          className="block rounded-control"
        ></iframe>
      )}
    </div>
  )
}
