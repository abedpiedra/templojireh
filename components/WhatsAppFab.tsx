'use client'

import { useEffect, useState } from 'react'

const MENSAJE = encodeURIComponent(
  'Hola, vi la web de Templo Jireh y quiero más información.',
)

/**
 * Acceso permanente al canal que la congregacion ya usa.
 *
 * Aparece despues del primer desplazamiento para no competir con el hero,
 * y entra por el mismo borde por el que saldria.
 */
export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false)
  const [pieALaVista, setPieALaVista] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Al llegar al pie, el boton se aparta: ahi ya hay contacto visible
  // y tapaba el aviso de derechos reservados.
  useEffect(() => {
    const pie = document.getElementById('pie-sitio')
    if (!pie) return
    const observer = new IntersectionObserver(
      ([entrada]) => setPieALaVista(entrada.isIntersecting),
      { rootMargin: '0px 0px -35% 0px' },
    )
    observer.observe(pie)
    return () => observer.disconnect()
  }, [])

  const mostrar = visible && !pieALaVista

  return (
    <a
      href={`https://wa.me/56957268552?text=${MENSAJE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="pressable fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-floating"
      style={{
        transform: mostrar ? 'translateY(0)' : 'translateY(120%)',
        opacity: mostrar ? 1 : 0,
        pointerEvents: mostrar ? 'auto' : 'none',
        transition:
          'transform 400ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  )
}
