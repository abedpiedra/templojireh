import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto y ubicación',
  description:
    'Templo Jireh: Presidente Alessandri #0498, La Granja, Santiago. Horarios de culto, teléfono, mapa y contacto directo por WhatsApp.',
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: 'Contacto y ubicación | Templo Jireh',
    description:
      'Dónde estamos, a qué hora nos reunimos y cómo escribirnos.',
    url: 'https://templojireh.cl/contacto',
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
