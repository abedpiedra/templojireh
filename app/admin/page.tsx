'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  sermones: number
  eventos: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ sermones: 0, eventos: 0 })
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [sermonesRes, eventosRes] = await Promise.all([
        fetch('/api/sermones'),
        fetch('/api/eventos'),
      ])
      const [sermones, eventos] = await Promise.all([
        sermonesRes.json(),
        eventosRes.json(),
      ])
      setStats({
        sermones: Array.isArray(sermones) ? sermones.length : 0,
        eventos: Array.isArray(eventos) ? eventos.length : 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">
            Templo <span className="text-primary">Jireh</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Panel Admin</p>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'dashboard' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <i className="fas fa-home w-5"></i> Dashboard
          </button>
          <Link
            href="/admin/sermones"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <i className="fas fa-bible w-5"></i> Sermones
          </Link>
          <Link
            href="/admin/eventos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <i className="fas fa-calendar-alt w-5"></i> Eventos
          </Link>
          <Link
            href="/admin/usuarios"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <i className="fas fa-users w-5"></i> Usuarios
          </Link>
          <div className="border-t border-white/10 my-4"></div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <i className="fas fa-globe w-5"></i> Ver Sitio
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-6 mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-dark">
            <i className="fas fa-cog text-primary mr-3"></i>
            Panel de Control
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Hola, <strong>{session.user?.name || 'Admin'}</strong>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Salir
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl mb-4">
              <i className="fas fa-bible"></i>
            </div>
            <h3 className="text-3xl font-bold text-dark">{stats.sermones}</h3>
            <p className="text-gray-500">Sermones</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3 className="text-3xl font-bold text-dark">{stats.eventos}</h3>
            <p className="text-gray-500">Eventos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xl mb-4">
              <i className="fas fa-eye"></i>
            </div>
            <h3 className="text-3xl font-bold text-dark">--</h3>
            <p className="text-gray-500">Visitas</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-dark mb-6">Acciones Rápidas</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin/sermones?new=true"
              className="p-6 bg-secondary text-white rounded-xl text-center hover:bg-secondary-dark transition-colors"
            >
              <i className="fas fa-plus text-2xl mb-2"></i>
              <p className="font-semibold">Nuevo Sermón</p>
            </Link>
            <Link
              href="/admin/eventos?new=true"
              className="p-6 bg-blue-500 text-white rounded-xl text-center hover:bg-blue-600 transition-colors"
            >
              <i className="fas fa-plus text-2xl mb-2"></i>
              <p className="font-semibold">Nuevo Evento</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
