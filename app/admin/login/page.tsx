'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Usuario o contraseña incorrectos.')
        setLoading(false)
      } else if (result?.ok) {
        // El estado de exito se ve en el propio boton; el dialogo del sistema
        // solo agregaba un paso extra antes de redirigir.
        window.location.replace('/admin')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
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
          <h1 className="type-title-2 text-dark">Panel de administración</h1>
          <p className="type-footnote text-ink-tertiary mt-1">
            Ingresa con tu cuenta autorizada.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-control bg-primary-tint px-4 py-3 type-footnote text-primary-dark"
          >
            <i className="fas fa-circle-exclamation mt-0.5"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              placeholder="admin@templojireh.cl"
              required
            />
          </div>

          <div className="mb-6">
            <label className="field-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              placeholder="••••••••"
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
                <i className="fas fa-spinner fa-spin"></i> Ingresando…
              </>
            ) : (
              <>
                <i className="fas fa-arrow-right-to-bracket"></i> Iniciar sesión
              </>
            )}
          </button>
        </form>

        {/* Nunca sin salida */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="pressable type-footnote text-ink-tertiary hover:text-primary"
          >
            <i className="fas fa-arrow-left mr-2"></i> Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}
