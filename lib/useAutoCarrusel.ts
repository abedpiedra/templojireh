'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './spring'

interface Opciones {
  /** Milisegundos entre avances automáticos. */
  intervalo?: number
  /** Espera antes de retomar el avance tras un gesto del usuario. */
  reanudar?: number
}

/**
 * Carrusel que avanza solo, sin quitarle el control a la persona.
 *
 * Se apoya en el desplazamiento nativo con scroll-snap en lugar de animar
 * transformaciones: así el gesto del dedo interrumpe el avance en
 * cualquier instante, conserva el momentum del sistema y puede ir hacia
 * atrás igual que hacia adelante.
 *
 * Se detiene cuando la persona interviene, cuando el carrusel sale de
 * pantalla, cuando la pestaña deja de estar visible y cuando el sistema
 * pide movimiento reducido.
 */
export function useAutoCarrusel<T extends HTMLElement>(
  { intervalo = 5000, reanudar = 7000 }: Opciones = {},
) {
  const ref = useRef<T | null>(null)
  const [indice, setIndice] = useState(0)
  const enPantalla = useRef(false)
  const pausadoHasta = useRef(0)
  const avanzandoSolo = useRef(false)

  const items = useCallback(() => {
    const el = ref.current
    if (!el) return [] as HTMLElement[]
    return Array.from(el.children) as HTMLElement[]
  }, [])

  const indiceActual = useCallback(() => {
    const el = ref.current
    const hijos = items()
    if (!el || hijos.length === 0) return 0
    // El más cercano al borde izquierdo del área visible
    let mejor = 0
    let menorDistancia = Infinity
    hijos.forEach((hijo, i) => {
      const d = Math.abs(hijo.offsetLeft - el.scrollLeft)
      if (d < menorDistancia) {
        menorDistancia = d
        mejor = i
      }
    })
    return mejor
  }, [items])

  const irA = useCallback(
    (destino: number, suave = true) => {
      const el = ref.current
      const hijos = items()
      if (!el || hijos.length === 0) return
      const i = ((destino % hijos.length) + hijos.length) % hijos.length
      avanzandoSolo.current = true
      el.scrollTo({
        left: hijos[i].offsetLeft,
        behavior: suave && !prefersReducedMotion() ? 'smooth' : 'auto',
      })
      setIndice(i)
      // Se libera la marca cuando el desplazamiento ya terminó
      window.setTimeout(() => {
        avanzandoSolo.current = false
      }, 700)
    },
    [items],
  )

  // Pausa al tocar: el gesto siempre gana sobre el avance automático
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const pausar = () => {
      pausadoHasta.current = Date.now() + reanudar
    }
    const alDesplazar = () => {
      if (!avanzandoSolo.current) pausar()
      setIndice(indiceActual())
    }

    el.addEventListener('pointerdown', pausar)
    el.addEventListener('wheel', pausar, { passive: true })
    el.addEventListener('scroll', alDesplazar, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', pausar)
      el.removeEventListener('wheel', pausar)
      el.removeEventListener('scroll', alDesplazar)
    }
  }, [indiceActual, reanudar])

  // Fuera de pantalla no tiene sentido avanzar
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entrada]) => {
        enPantalla.current = entrada.isIntersecting
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Reloj del avance automático
  useEffect(() => {
    if (prefersReducedMotion()) return

    const id = window.setInterval(() => {
      if (!enPantalla.current) return
      if (document.hidden) return
      if (Date.now() < pausadoHasta.current) return

      const el = ref.current
      const hijos = items()
      if (!el || hijos.length < 2) return

      // Al llegar al final se vuelve al principio de forma explícita: el
      // último elemento no siempre puede quedar alineado al borde, así que
      // guiarse solo por el índice dejaba una tarjeta sin mostrar.
      const finDeRecorrido = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
      irA(finDeRecorrido ? 0 : indiceActual() + 1)
    }, intervalo)

    return () => window.clearInterval(id)
  }, [indiceActual, intervalo, irA, items])

  return { ref, indice, irA }
}
