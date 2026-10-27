/**
 * Banda de cierre sobre fondo de marca.
 *
 * Sigue al tema: en claro es un rubor de rojo de marca y en oscuro el
 * grafito de siempre. El texto usa los tokens ink, así que se adapta solo.
 */
export default function BandaCta({
  titulo,
  texto,
  encabezado,
  children,
}: {
  titulo?: string
  texto?: string
  /** Encabezado propio, para cuando el texto se calcula en el cliente. */
  encabezado?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden seccion text-center text-ink">
      <div className="brand-wash-tema absolute inset-0" aria-hidden="true" />
      <div className="container relative mx-auto px-4">
        {encabezado ?? (
          <>
            <h2 className="type-title-1">{titulo}</h2>
            <p className="type-body-lg mx-auto mt-4 max-w-lg text-ink-secondary">
              {texto}
            </p>
          </>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {children}
        </div>
      </div>
    </section>
  )
}
