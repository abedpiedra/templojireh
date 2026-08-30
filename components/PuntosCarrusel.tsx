/**
 * Posición dentro de un carrusel, y atajo para saltar a cualquier tarjeta.
 *
 * El punto se ve pequeño; el área que recibe el dedo mide 44x44.
 */
export default function PuntosCarrusel({
  total,
  indice,
  irA,
  etiqueta,
  className = '',
}: {
  total: number
  indice: number
  irA: (i: number) => void
  /** Se usa para nombrar cada punto: "Ver {etiqueta} 2". */
  etiqueta: string
  className?: string
}) {
  if (total < 2) return null

  return (
    <div className={`flex justify-center gap-2 md:hidden ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Ver ${etiqueta} ${i + 1}`}
          aria-current={i === indice}
          onPointerDown={() => irA(i)}
          className="flex h-11 w-11 items-center justify-center"
        >
          <span
            className={`block h-1.5 rounded-full transition-all duration-300 ease-spring ${
              i === indice ? 'w-5 bg-primary' : 'w-1.5 bg-ink-quaternary'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
