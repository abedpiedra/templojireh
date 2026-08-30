'use client'

import { useEffect, useState } from 'react'
import { proximaJornada } from '@/lib/horarios'

/** Lo que se entrega desde el servidor y en el primer render del cliente. */
const RESPALDO = {
  cuando: 'este domingo',
  detalle: 'Escuela Dominical 10:00 · Servicio de Adoración 11:15',
}

/**
 * Invitación a la próxima jornada, con su día y sus reuniones.
 *
 * El texto se calcula con la hora local de quien visita: un martes por la
 * tarde invita al servicio de esa noche, no al domingo siguiente.
 *
 * El primer render usa el respaldo —el mismo en servidor y cliente— y el
 * dato real entra después de montar: así no hay discrepancia de hidratación.
 */
export default function InvitacionJornada({
  tamano = 'grande',
}: {
  tamano?: 'grande' | 'compacto'
}) {
  const [jornada, setJornada] = useState(RESPALDO)

  useEffect(() => {
    const actualizar = () => setJornada(proximaJornada() ?? RESPALDO)
    actualizar()
    const id = setInterval(actualizar, 30 * 60 * 1000)
    const alVolver = () => {
      if (!document.hidden) actualizar()
    }
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [])

  if (tamano === 'compacto') {
    return (
      <div>
        <p className="type-title-2">Te esperamos {jornada.cuando}</p>
        <p className="type-footnote text-white/60 mt-1">{jornada.detalle}</p>
      </div>
    )
  }

  return (
    <>
      <h2 className="type-title-1">Te esperamos {jornada.cuando}</h2>
      <p className="type-body-lg mx-auto mt-4 max-w-lg text-white/70">
        {jornada.detalle}, en Presidente Alessandri #0498, La Granja.
      </p>
    </>
  )
}
