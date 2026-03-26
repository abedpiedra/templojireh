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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    )
  }

  // Si no necesita setup, mostrar mensaje mientras redirige
  if (!needsSetup) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">
            Templo <span className="text-primary">Jireh</span>
          </h1>
          <p className="text-gray-500 mt-2">Configuración Inicial</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <h2 className="text-xl font-semibold text-dark mb-2">Usuario creado exitosamente</h2>
            <p className="text-gray-500">Redirigiendo al login...</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <i className="fas fa-info-circle mr-2"></i>
                Crea el primer usuario administrador para comenzar a usar el panel.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="admin@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Repetir contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2"></i>
                    Crear Administrador
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
