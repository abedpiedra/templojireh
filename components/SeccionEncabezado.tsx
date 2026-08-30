/**
 * Encabezado de sección: etiqueta, título y bajada opcional.
 *
 * Se repetía en 17 lugares con el mismo par de clases. Centralizarlo evita
 * que una página quede con otro ritmo cuando se ajusta la escala.
 */
export default function SeccionEncabezado({
  etiqueta,
  titulo,
  descripcion,
  accion,
  className = '',
}: {
  etiqueta: string
  titulo: string
  descripcion?: string
  /** Enlace o botón alineado a la derecha en pantallas anchas. */
  accion?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`mb-10 flex flex-wrap items-end justify-between gap-4 ${className}`}
    >
      <div className="max-w-xl">
        <p className="section-subtitle">{etiqueta}</p>
        <h2 className={`section-title ${descripcion ? '' : 'mb-0'}`}>{titulo}</h2>
        {descripcion && (
          <p className="type-body text-ink-secondary">{descripcion}</p>
        )}
      </div>
      {accion}
    </div>
  )
}
