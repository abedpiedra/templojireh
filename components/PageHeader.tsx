import Link from 'next/link'

interface PageHeaderProps {
  title: string
  breadcrumb: string
  /** Frase corta que responde "que hay aqui" antes de bajar a la pagina. */
  description?: string
}

export default function PageHeader({ title, breadcrumb, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-dark text-white">
      {/* Profundidad sin imagen de stock: capas de color estables y ligeras */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(110% 100% at 12% 0%, rgba(228,19,47,0.38) 0%, rgba(16,16,18,0) 58%), radial-gradient(80% 90% at 85% 10%, rgba(123,18,42,0.45) 0%, rgba(16,16,18,0) 62%), linear-gradient(160deg, #101012 0%, #26262b 100%)',
        }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 relative pt-16 pb-14 md:pt-24 md:pb-20">
        {/* Orientacion: donde estoy y como salgo */}
        <nav aria-label="Ruta" className="type-footnote text-white/60 mb-3">
          <Link href="/" className="pressable inline-block hover:text-white">
            Inicio
          </Link>
          <span className="mx-2 text-white/30">/</span>
          <span className="text-white/90">{breadcrumb}</span>
        </nav>
        <h1 className="type-display">{title}</h1>
        {description && (
          <p className="type-body-lg text-white/70 mt-3 max-w-xl">{description}</p>
        )}
      </div>
    </section>
  )
}
