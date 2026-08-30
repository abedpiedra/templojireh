/**
 * Tarjeta de "todavía no hay nada aquí".
 *
 * Dice qué falta y ofrece una salida, en vez de dejar un hueco.
 */
export default function EstadoVacio({
  icono,
  titulo,
  texto,
  children,
  compacto = false,
}: {
  icono: string
  titulo?: string
  texto: string
  children?: React.ReactNode
  /** Una franja en línea, para cuando el vacío es un filtro sin resultados. */
  compacto?: boolean
}) {
  if (compacto) {
    return (
      <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <i className={`${icono} text-xl text-ink-quaternary`}></i>
          <p className="type-footnote text-ink-secondary">{texto}</p>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="card p-12 text-center">
      <i className={`${icono} mb-4 block text-3xl text-ink-quaternary`}></i>
      {titulo && <h3 className="type-title-3 text-ink">{titulo}</h3>}
      <p className="type-body text-ink-secondary mt-1">{texto}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
