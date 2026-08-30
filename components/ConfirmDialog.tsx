'use client'

import Modal from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  /** Que se pierde exactamente: sin ambiguedad antes de un paso irreversible. */
  message: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmacion reservada para acciones destructivas e irreversibles.
 * Para todo lo demas basta con poder deshacer.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="type-body text-ink-secondary">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Eliminando…
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </Modal>
  )
}
