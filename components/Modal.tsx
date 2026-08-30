'use client'

import { useEffect, useRef, useState } from 'react'
import { useSheet } from '@/lib/useSheet'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  /** Texto corto bajo el titulo: que hace esta pantalla. */
  description?: string
  children: React.ReactNode
}

function useIsCompact() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setCompact(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return compact
}

/**
 * Tarea modal: la superficie se acompana de un velo que atenua y empuja
 * el fondo hacia atras. En movil se presenta como hoja agarrable desde
 * el borde inferior; en escritorio se materializa centrada.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  const compact = useIsCompact()
  const contenedor = useRef<HTMLDivElement | null>(null)

  const { mounted, sheetRef, scrimRef, dragHandlers } = useSheet({
    open: open && compact,
    onClose,
    from: 'bottom',
  })

  // Escape siempre cierra: nunca se atrapa al usuario dentro de la tarea
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [open, onClose])

  // Al abrir, el foco entra en la tarea
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      const foco = contenedor.current?.querySelector<HTMLElement>(
        'input, select, textarea, button',
      )
      foco?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [open, compact])

  const cabecera = (
    <div className="flex items-start justify-between gap-4 border-b border-separator px-6 py-5">
      <div>
        <h2 className="type-title-2 text-dark">{title}</h2>
        {description && (
          <p className="type-footnote text-ink-tertiary mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onPointerDown={onClose}
        aria-label="Cerrar"
        className="pressable -mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-quaternary/25 text-ink-secondary"
      >
        <i className="fas fa-xmark"></i>
      </button>
    </div>
  )

  if (compact) {
    if (!mounted) return null
    return (
      <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
        <div
          ref={scrimRef}
          className="scrim absolute inset-0"
          style={{ opacity: 0 }}
          onPointerDown={onClose}
          aria-hidden="true"
        />
        <div
          ref={sheetRef}
          className="sheet-surface absolute inset-x-0 bottom-0 max-h-[92vh] overflow-hidden rounded-b-none"
        >
          {/* Solo el asa arrastra: dentro se puede desplazar el contenido */}
          <div className="cursor-grab py-3" style={{ touchAction: 'none' }} {...dragHandlers}>
            <div className="sheet-grabber" />
          </div>
          {cabecera}
          <div
            ref={contenedor}
            className="max-h-[70vh] overflow-y-auto overscroll-contain px-6 py-5"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 hidden items-center justify-center p-4 md:flex"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="scrim absolute inset-0"
        onPointerDown={onClose}
        aria-hidden="true"
      />
      <div className="sheet-surface animate-materialize relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden">
        {cabecera}
        <div ref={contenedor} className="overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
