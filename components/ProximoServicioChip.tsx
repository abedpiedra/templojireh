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
    <p className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 type-footnote text-white backdrop-blur animate-rise-in">
      <i className={`fas ${etiqueta.icon} text-primary-light`}></i>
      <span className="font-semibold">Próxima reunión:</span>
      {etiqueta.nombre} · {etiqueta.cuando}
    </p>
  )
}
