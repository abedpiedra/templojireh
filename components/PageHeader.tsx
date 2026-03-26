import Link from 'next/link'

interface PageHeaderProps {
  title: string
  breadcrumb: string
}

export default function PageHeader({ title, breadcrumb }: PageHeaderProps) {
  return (
    <section
      className="relative py-20 text-white text-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(26, 26, 46, 0.85), rgba(26, 26, 46, 0.85)), url(https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
        <div className="text-gray-300">
          <Link href="/" className="text-primary hover:underline">Inicio</Link> / {breadcrumb}
        </div>
      </div>
    </section>
  )
}
