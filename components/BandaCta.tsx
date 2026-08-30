/**
 * Banda de cierre sobre fondo de marca.
 *
 * Es siempre oscura, en tema claro y en oscuro: es una superficie de marca,
 * no una superficie de interfaz, así que no sigue al tema.
 */
export default function BandaCta({
  titulo,
  texto,
  children,
}: {
  titulo: string
  texto: string
  children: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-dark seccion text-center text-white">
      <div className="brand-wash absolute inset-0" aria-hidden="true" />
      <div className="container relative mx-auto px-4">
        <h2 className="type-title-1">{titulo}</h2>
        <p className="type-body-lg mx-auto mt-4 max-w-lg text-white/70">{texto}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {children}
        </div>
      </div>
    </section>
  )
}
