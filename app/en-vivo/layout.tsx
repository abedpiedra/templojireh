import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transmisiones en vivo',
  description:
    'Sigue el culto de Templo Jireh en vivo y revisa el archivo completo de transmisiones y predicaciones anteriores.',
  alternates: { canonical: '/en-vivo' },
  openGraph: {
    title: 'Transmisiones en vivo | Templo Jireh',
    description:
      'Culto en vivo y archivo de predicaciones de Templo Jireh, La Granja.',
    url: 'https://templojireh.cl/en-vivo',
  },
}

export default function EnVivoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
