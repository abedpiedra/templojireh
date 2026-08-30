'use client'

import { useAutoCarrusel } from '@/lib/useAutoCarrusel'
import PuntosCarrusel from '@/components/PuntosCarrusel'

interface Horario {
  icon: string
  title: string
  time: string
}

/**
 * Horarios en una tira que avanza sola y se puede arrastrar en ambos
 * sentidos. En escritorio hay espacio para las cuatro a la vez, así que
 * el carrusel solo existe en pantallas pequeñas.
 */
export default function HorariosCarrusel({ horarios }: { horarios: Horario[] }) {
  const { ref, indice, irA } = useAutoCarrusel<HTMLDivElement>({ intervalo: 4000 })

  return (
    <div className="material-thick overflow-hidden rounded-card border border-white/40 shadow-floating">
      <div
        ref={ref}
        className="snap-row no-scrollbar flex overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible"
      >
        {horarios.map((item) => (
          <div
            key={item.title}
            // Una tarjeta por pantalla: dejar asomar la siguiente la mostraba
            // partida a la mitad y se leia como un recorte, no como un aviso
            // de que hay mas. Los puntos de abajo ya cumplen ese papel.
            className="snap-item min-w-full px-5 py-5 md:min-w-0 md:border-r md:border-separator md:px-6 md:py-7 md:last:border-r-0"
          >
            <i
              className={`fas ${item.icon} mb-2.5 block text-lg text-primary md:mb-3 md:text-xl`}
              aria-hidden="true"
            ></i>
            <h2 className="type-title-3 vibrant-primary">{item.title}</h2>
            <p className="type-footnote vibrant-secondary mt-1">{item.time}</p>
          </div>
        ))}
      </div>

      <PuntosCarrusel
        total={horarios.length}
        indice={indice}
        irA={irA}
        etiqueta="horario"
        className="pb-3"
      />
    </div>
  )
}
