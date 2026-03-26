import Image from 'next/image'
import Link from 'next/link'

interface BlogCardProps {
  titulo: string
  slug: string
  fecha: string
  categoria: string
  autor: string
  excerpt: string
  imagen?: string
}

export default function BlogCard({ titulo, slug, fecha, categoria, autor, excerpt, imagen }: BlogCardProps) {
  const fechaObj = new Date(fecha)
  const dia = fechaObj.getDate()
  const mes = fechaObj.toLocaleDateString('es-ES', { month: 'short' })

  return (
    <article className="card">
      <div className="relative h-60 group">
        <Image
          src={imagen || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800'}
          alt={titulo}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-2 rounded text-center">
          <span className="text-xl font-bold block">{dia}</span>
          <span className="text-xs uppercase">{mes}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
          <span><i className="fas fa-user text-primary mr-1"></i> {autor}</span>
          <span><i className="fas fa-folder text-primary mr-1"></i> {categoria}</span>
        </div>
        <h2 className="text-xl font-semibold text-dark mb-3 hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>{titulo}</Link>
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="inline-block px-5 py-2 bg-secondary text-white rounded font-medium text-sm hover:bg-secondary-dark transition-colors">
          Leer Más
        </Link>
      </div>
    </article>
  )
}
