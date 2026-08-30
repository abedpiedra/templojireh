import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Redes sociales',
  description:
    'Cuentas oficiales de Templo Jireh en Instagram, Facebook y YouTube: anuncios, actividades y transmisiones.',
  alternates: { canonical: '/redes' },
  openGraph: {
    title: 'Redes sociales | Templo Jireh',
    description:
      'Síguenos en Instagram, Facebook y YouTube.',
    url: 'https://templojireh.cl/redes',
  },
}

export default function RedesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
