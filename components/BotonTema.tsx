'use client'

import { useEffect, useState } from 'react'
import { CLAVE_TEMA, aplicarTema, temaInicial, type Tema } from '@/lib/tema'

/**
 * Conmutador de tema.
 *
 * El icono muestra a dónde va a ir, no dónde está: en claro ofrece la luna.
 * La elección se guarda; mientras no haya elección, manda el sistema.
 */
export default function BotonTema({ claro = false }: { claro?: boolean }) {
  const [tema, setTema] = useState<Tema | null>(null)

  useEffect(() => {
    setTema(temaInicial())
  }, [])

  // Si la persona nunca eligió, seguir los cambios del sistema en vivo
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const alCambiar = () => {
      if (localStorage.getItem(CLAVE_TEMA)) return
      const nuevo: Tema = mq.matches ? 'oscuro' : 'claro'
      setTema(nuevo)
      aplicarTema(nuevo)
    }
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  const alternar = () => {
    const nuevo: Tema = tema === 'oscuro' ? 'claro' : 'oscuro'
    setTema(nuevo)
    aplicarTema(nuevo)
    localStorage.setItem(CLAVE_TEMA, nuevo)
  }

  const esOscuro = tema === 'oscuro'

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={esOscuro ? 'Modo claro' : 'Modo oscuro'}
      className={`pressable flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
        claro
          ? 'text-white hover:bg-white/15'
          : 'bg-fill/15 text-ink hover:bg-fill/25'
      }`}
    >
      {/* Hasta saber el tema no se dibuja icono: evita que parpadee al
          hidratarse mostrando el contrario durante un instante */}
      {tema !== null && (
        <i className={`fas ${esOscuro ? 'fa-sun' : 'fa-moon'}`}></i>
      )}
    </button>
  )
}
