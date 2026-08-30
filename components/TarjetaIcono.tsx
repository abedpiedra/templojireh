/**
 * Tarjeta de icono con título y texto.
 *
 * En el teléfono el icono va al costado —apilarlo hacía que tres tarjetas
 * ocuparan casi tres pantallas— y en escritorio vuelve arriba.
 */
export default function TarjetaIcono({
  icono,
  titulo,
  texto,
  children,
}: {
  icono: string
  titulo: string
  texto: string
  /** Enlace o acción al pie de la tarjeta. */
  children?: React.ReactNode
}) {
  return (
    <article className="card flex gap-4 p-5 md:block md:p-7">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-tint md:mb-5 md:h-12 md:w-12">
        <i className={`fas ${icono} text-primary`}></i>
      </div>
      <div>
        <h3 className="type-title-3 text-ink mb-1 md:mb-2">{titulo}</h3>
        <p className="type-footnote text-ink-secondary">{texto}</p>
        {children}
      </div>
    </article>
  )
}
