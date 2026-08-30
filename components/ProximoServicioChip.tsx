'use client'

import { useEffect, useState } from 'react'
import { etiquetaProximoServicio } from '@/lib/horarios'

/**
 * Responde de inmediato la pregunta con la que llega casi toda visita
 * nueva: "cuando puedo ir". Se calcula con la hora local del visitante.
 */
export default function ProximoServicioChip() {
  const [etiqueta, setEtiqueta] = useState<{
    nombre: string
    icon: string
    cuando: string
  } | null>(null)

  useEffect(() => {
    setEtiqueta(etiquetaProximoServicio())
    // Se refresca cada media hora por si la pestana queda abierta
    const id = setInterval(() => setEtiqueta(etiquetaProximoServicio()), 1800000)
    return () => clearInterval(id)
  }, [])

  if (!etiqueta) return null

  return (
    // Una sola linea y compacta. El nombre del servicio es lo unico que
    // puede crecer ("Servicio de Adoración"), asi que es lo unico que se
    // recorta si no cabe: el dia y la hora siempre quedan visibles.
    <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[0.8125rem] leading-none text-white backdrop-blur animate-rise-in sm:text-sm">
      <i className={`fas ${etiqueta.icon} shrink-0 text-primary-light`}></i>
      <span className="shrink-0 font-semibold text-white/70">Próxima:</span>
      <span className="truncate">{etiqueta.nombre}</span>
      <span className="shrink-0 text-white/50">·</span>
      <span className="shrink-0">{etiqueta.cuando}</span>
    </p>
  )
}
