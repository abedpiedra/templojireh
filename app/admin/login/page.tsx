'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        setError('Usuario o contraseña incorrectos')
        setLoading(false)
      } else if (result?.ok) {
        alert('Login exitoso! Redirigiendo...')
        window.location.replace('/admin')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">
            Templo <span className="text-primary">Jireh</span>
          </h1>
          <p className="text-gray-500 mt-2">Panel de Administración</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="admin@templojireh.com"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Ingresando...</>
            ) : (
              <><i className="fas fa-sign-in-alt mr-2"></i> Iniciar Sesión</>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}
