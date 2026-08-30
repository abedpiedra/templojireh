'use client'

import { useAutoCarrusel } from '@/lib/useAutoCarrusel'

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

      {/* Posición dentro de la tira, y atajo para saltar a cualquiera.
          Solo en pantallas donde el carrusel existe. */}
      <div className="flex justify-center gap-2 pb-3 md:hidden">
        {horarios.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Ver ${item.title}`}
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
    </div>
  )
}
