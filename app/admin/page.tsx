'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Stats {
  sermones: number
  confirmaciones: number
  jovenesEstimados: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    sermones: 0,
    confirmaciones: 0,
    jovenesEstimados: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const fetchStats = async () => {
    try {
      const [sermonesRes, confirmacionesRes] = await Promise.all([
        fetch('/api/sermones'),
        fetch('/api/invitacion-jovenes55/confirmaciones', { cache: 'no-store' }),
      ])
      const sermones = await sermonesRes.json()
      const confirmaciones = confirmacionesRes.ok
        ? await confirmacionesRes.json()
        : null

      setStats({
        sermones: Array.isArray(sermones) ? sermones.length : 0,
        confirmaciones: confirmaciones?.stats?.total || 0,
        jovenesEstimados: confirmaciones?.stats?.estimatedYouth || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <header className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-dark">
          <i className="fas fa-cog text-primary mr-3"></i>
          Panel de Control
        </h2>
        <span className="text-gray-600">
          Hola, <strong>{session.user?.name || 'Admin'}</strong>
        </span>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl mb-4">
            <i className="fas fa-bible"></i>
          </div>
          <h3 className="text-3xl font-bold text-dark">{stats.sermones}</h3>
          <p className="text-gray-500">Sermones</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <h3 className="text-3xl font-bold text-dark">
            {stats.confirmaciones}
          </h3>
          <p className="text-gray-500">Confirmaciones Jovenes 55</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4">
            <i className="fas fa-users"></i>
          </div>
          <h3 className="text-3xl font-bold text-dark">
            {stats.jovenesEstimados}
          </h3>
          <p className="text-gray-500">Jovenes estimados</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-xl font-bold text-dark mb-6">Acciones Rapidas</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/admin/sermones?new=true"
            className="p-6 bg-secondary text-white rounded-xl text-center hover:bg-secondary-dark transition-colors"
          >
            <i className="fas fa-plus text-2xl mb-2"></i>
            <p className="font-semibold">Nuevo Sermon</p>
          </Link>
          <Link
            href="/admin/invitacion-jovenes55"
            className="p-6 bg-primary text-white rounded-xl text-center hover:bg-primary-dark transition-colors"
          >
            <i className="fas fa-clipboard-list text-2xl mb-2"></i>
            <p className="font-semibold">Ver Confirmaciones</p>
          </Link>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/youtube/sync', { method: 'POST' })
                const data = await res.json()
                if (res.ok) {
                  alert(`Sincronizacion exitosa: ${data.synced} videos`)
                } else {
                  alert('Error: ' + data.error)
                }
              } catch {
                alert('Error al sincronizar')
              }
            }}
            className="p-6 bg-red-500 text-white rounded-xl text-center hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-sync text-2xl mb-2"></i>
            <p className="font-semibold">Sincronizar YouTube</p>
          </button>
        </div>
      </div>
    </>
  )
}
