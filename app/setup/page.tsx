'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const res = await fetch('/api/setup')
      const data = await res.json()
      setNeedsSetup(data.needsSetup)

      // Si ya hay usuarios, redirigir al login inmediatamente
      if (!data.needsSetup) {
        router.replace('/admin/login')
      }
    } catch (error) {
      // Si hay error, asumir que necesita setup
      setNeedsSetup(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess(true)
      setTimeout(() => {
        router.replace('/admin/login')
      }, 2000)

    } catch (error: any) {
      setError(error.message || 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  // Mientras verifica, mostrar loading
  if (needsSetup === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas-sunken">
        <div className="h-10 w-10 animate-pulse rounded-full bg-ink-quaternary/40" />
      </div>
    )
  }

  // Si no necesita setup, mostrar mensaje mientras redirige
  if (!needsSetup) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas-sunken">
        <p className="type-footnote text-ink-secondary">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Redirigiendo…
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark p-4">
      <div className="brand-wash absolute inset-0" aria-hidden="true" />
      <div className="sheet-surface relative w-full max-w-md p-8 md:p-10">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/isotipo-jireh.svg"
            alt="Templo Jireh"
            width={56}
            height={56}
            className="mx-auto mb-4 h-14 w-auto"
          />
          <h1 className="type-title-2 text-dark">Configuración inicial</h1>
          <p className="type-footnote text-ink-tertiary mt-1">
            Solo se hace una vez.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center animate-rise-in">
            <i className="fas fa-circle-check mb-4 block text-4xl text-success"></i>
            <h2 className="type-title-3 text-dark">Administrador creado</h2>
            <p className="type-footnote text-ink-secondary mt-1">
              Te llevamos al inicio de sesión…
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 flex items-start gap-2 rounded-control bg-canvas-sunken px-4 py-3 type-footnote text-ink-secondary">
              <i className="fas fa-circle-info mt-0.5 text-ink-tertiary"></i>
              Crea el primer usuario administrador para empezar a usar el panel.
            </p>

            {error && (
              <p
                role="alert"
                className="mb-6 flex items-center gap-2 rounded-control bg-primary-tint px-4 py-3 type-footnote text-primary-dark animate-rise-in"
              >
                <i className="fas fa-circle-exclamation"></i>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="field"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="field"
                  placeholder="admin@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="field-label">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="field"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <label className="field-label">Confirmar contraseña</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="field"
                  placeholder="Repetir contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creando…
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    Crear administrador
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
