import Link from 'next/link'

interface PageHeaderProps {
  title: string
  breadcrumb: string
  /** Frase corta que responde "que hay aqui" antes de bajar a la pagina. */
  description?: string
}

export default function PageHeader({ title, breadcrumb, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-separator text-ink">
      {/* Profundidad sin imagen de stock: capas de color estables y ligeras,
          claras en tema claro y grafito en oscuro */}
      <div className="header-wash absolute inset-0" aria-hidden="true" />
      <div className="container mx-auto px-4 relative pt-16 pb-14 md:pt-24 md:pb-20">
        {/* Orientacion: donde estoy y como salgo */}
        <nav aria-label="Ruta" className="type-footnote text-ink-tertiary mb-3">
          <Link href="/" className="pressable tactil -ml-2 px-2 hover:text-ink">
            Inicio
          </Link>
          <span className="mx-2 text-ink-quaternary">/</span>
          <span className="text-ink">{breadcrumb}</span>
        </nav>
        <h1 className="type-display">{title}</h1>
        {description && (
          <p className="type-body-lg text-ink-secondary mt-3 max-w-xl">{description}</p>
        )}
      </div>
    </section>
  )
}
