'use client'

import { useEffect, useState } from 'react'
import { etiquetaProximoServicio } from './horarios'

/** Cada media hora: suficiente para que una pestaña abierta no mienta. */
const REFRESCO = 30 * 60 * 1000

/**
 * Próxima reunión según la hora local de quien visita.
 *
 * Devuelve null en el primer render: la hora local solo existe en el
 * navegador, y calcularla en el servidor haría que el HTML entregado no
 * coincida con el del cliente.
 */
export function useProximoServicio() {
  const [etiqueta, setEtiqueta] = useState<{
    nombre: string
    icon: string
    cuando: string
  } | null>(null)

  useEffect(() => {
    const actualizar = () => setEtiqueta(etiquetaProximoServicio())
    actualizar()
    const id = setInterval(actualizar, REFRESCO)
    // Al volver a la pestaña se recalcula: puede haber pasado la reunión
    const alVolver = () => {
      if (!document.hidden) actualizar()
    }
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [])

  return etiqueta
}
