'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface Stats {
  confirmaciones: number
  jovenesEstimados: number
}

type SyncState =
  | { estado: 'inactivo' }
  | { estado: 'sincronizando' }
  | { estado: 'ok'; mensaje: string }
  | { estado: 'error'; mensaje: string }

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    confirmaciones: 0,
    jovenesEstimados: 0,
  })
  const [sync, setSync] = useState<SyncState>({ estado: 'inactivo' })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const fetchStats = useCallback(async () => {
    try {
      const confirmacionesRes = await fetch(
        '/api/invitacion-jovenes55/confirmaciones',
        { cache: 'no-store' },
      )
      const confirmaciones = confirmacionesRes.ok
        ? await confirmacionesRes.json()
        : null

      setStats({
        confirmaciones: confirmaciones?.stats?.total || 0,
        jovenesEstimados: confirmaciones?.stats?.estimatedYouth || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status, fetchStats])

  const sincronizarYoutube = async () => {
    setSync({ estado: 'sincronizando' })
    try {
      const res = await fetch('/api/youtube/sync', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setSync({
          estado: 'ok',
          mensaje: `${data.synced} videos sincronizados.`,
        })
      } else {
        setSync({ estado: 'error', mensaje: data.error || 'No se pudo sincronizar.' })
      }
    } catch {
      setSync({ estado: 'error', mensaje: 'No se pudo conectar con YouTube.' })
    }
  }

  if (status === 'loading') {
    // Esqueleto con la forma del panel, no un spinner a pantalla completa
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-card bg-ink-quaternary/20" />
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-card bg-ink-quaternary/20"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const tarjetas = [
    {
      valor: stats.confirmaciones,
      label: 'Confirmaciones Jóvenes 55',
      icon: 'fas fa-clipboard-check',
    },
    {
      valor: stats.jovenesEstimados,
      label: 'Jóvenes estimados',
      icon: 'fas fa-users',
    },
  ]

  return (
    <>
      <header className="mb-8">
        <p className="section-subtitle">Administración</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="type-title-1 text-dark mb-0">Panel de control</h1>
          <p className="type-footnote text-ink-tertiary">
            Hola, <strong className="text-ink">{session.user?.name || 'Admin'}</strong>
          </p>
        </div>
      </header>

      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        {tarjetas.map((t) => (
          <div key={t.label} className="card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-tint">
              <i className={`${t.icon} text-primary`}></i>
            </div>
            <p className="type-display text-dark" style={{ fontSize: '2.25rem' }}>
              {t.valor}
            </p>
            <p className="type-footnote text-ink-secondary mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      <section className="card p-6 md:p-8">
        <h2 className="type-title-2 text-dark mb-1">Acciones rápidas</h2>
        <p className="type-footnote text-ink-tertiary mb-6">
          Lo que se usa a diario, a un toque de distancia.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/invitacion-jovenes55"
            className="pressable flex items-center gap-4 rounded-card bg-canvas-sunken p-5 hover:bg-ink-quaternary/20"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-dark text-white">
              <i className="fas fa-clipboard-list"></i>
            </span>
            <span className="type-footnote font-semibold text-dark">
              Ver confirmaciones
            </span>
          </Link>

          <button
            type="button"
            onClick={sincronizarYoutube}
            disabled={sync.estado === 'sincronizando'}
            className="pressable flex items-center gap-4 rounded-card bg-canvas-sunken p-5 text-left hover:bg-ink-quaternary/20 disabled:opacity-60"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-white">
              <i
                className={`fas fa-rotate ${sync.estado === 'sincronizando' ? 'fa-spin' : ''}`}
              ></i>
            </span>
            <span className="type-footnote font-semibold text-dark">
              {sync.estado === 'sincronizando'
                ? 'Sincronizando…'
                : 'Sincronizar YouTube'}
            </span>
          </button>
        </div>

        {/* El resultado aparece donde ocurrio la accion, no en un dialogo aparte */}
        {(sync.estado === 'ok' || sync.estado === 'error') && (
          <p
            role="status"
            className={`mt-4 flex items-center gap-2 rounded-control px-4 py-3 type-footnote animate-rise-in ${
              sync.estado === 'ok'
                ? 'bg-success-tint text-success'
                : 'bg-primary-tint text-primary-dark'
            }`}
          >
            <i
              className={`fas ${sync.estado === 'ok' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}
            ></i>
            {sync.mensaje}
          </p>
        )}
      </section>
    </>
  )
}
