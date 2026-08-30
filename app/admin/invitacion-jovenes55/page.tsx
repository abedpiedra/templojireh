'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '@/components/ConfirmDialog'

type AttendanceValue = 'yes' | 'no'

interface Confirmation {
  _id: string
  churchName: string
  willAttend: AttendanceValue
  estimatedYouth: number
  createdAt: string
  updatedAt: string
}

interface ConfirmationStats {
  total: number
  attendingChurches: number
  notAttendingChurches: number
  estimatedYouth: number
  latestAt: string | null
}

const emptyStats: ConfirmationStats = {
  total: 0,
  attendingChurches: 0,
  notAttendingChurches: 0,
  estimatedYouth: 0,
  latestAt: null,
}

const filtrosAsistencia: { key: 'all' | AttendanceValue; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'yes', label: 'Sí asisten' },
  { key: 'no', label: 'No asisten' },
]

function formatDate(value?: string | null) {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function escapeCsv(value: string | number) {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export default function AdminInvitacionJovenes55Page() {
  const { status } = useSession()
  const router = useRouter()
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [stats, setStats] = useState<ConfirmationStats>(emptyStats)
  const [loading, setLoading] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [attendanceFilter, setAttendanceFilter] = useState<
    'all' | AttendanceValue
  >('all')
  const [porEliminar, setPorEliminar] = useState<Confirmation | null>(null)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const fetchConfirmations = useCallback(async () => {
    setActualizando(true)
    setError('')

    try {
      const res = await fetch('/api/invitacion-jovenes55/confirmaciones', {
        cache: 'no-store',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'No se pudieron cargar las confirmaciones.')
        return
      }

      setConfirmations(
        Array.isArray(data.confirmations) ? data.confirmations : [],
      )
      setStats(data.stats || emptyStats)
    } catch (error) {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
      setActualizando(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConfirmations()
    }
  }, [status, fetchConfirmations])

  const filteredConfirmations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return confirmations.filter((confirmation) => {
      const matchesSearch = confirmation.churchName
        .toLowerCase()
        .includes(normalizedSearch)
      const matchesAttendance =
        attendanceFilter === 'all' ||
        confirmation.willAttend === attendanceFilter

      return matchesSearch && matchesAttendance
    })
  }, [confirmations, search, attendanceFilter])

  const confirmarEliminacion = async () => {
    if (!porEliminar) return

    setEliminando(true)
    setError('')

    try {
      const res = await fetch(
        `/api/invitacion-jovenes55/confirmaciones/${porEliminar._id}`,
        { method: 'DELETE' },
      )
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'No se pudo eliminar la confirmación.')
        return
      }

      await fetchConfirmations()
    } catch (error) {
      setError('Error de conexión.')
    } finally {
      setEliminando(false)
      setPorEliminar(null)
    }
  }

  const exportCsv = () => {
    const rows = [
      ['Fecha', 'Iglesia', 'Asiste', 'Jovenes estimados'],
      ...filteredConfirmations.map((confirmation) => [
        formatDate(confirmation.createdAt),
        confirmation.churchName,
        confirmation.willAttend === 'yes' ? 'Si' : 'No',
        confirmation.estimatedYouth,
      ]),
    ]

    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n')
    const blob = new Blob([`﻿${csv}`], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `confirmaciones-jovenes55-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const exportPdf = async () => {
    // Carga diferida para no incluir la libreria en el bundle inicial
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginX = 14

    // Encabezado con los colores del isotipo
    doc.setFillColor(16, 16, 18) // negro de marca
    doc.rect(0, 0, pageWidth, 26, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('Templo Jireh', marginX, 13)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(228, 19, 47) // carmesi de marca
    doc.text('Confirmaciones Jovenes 55', marginX, 20)

    doc.setTextColor(200, 200, 200)
    doc.setFontSize(9)
    doc.text(
      `Generado: ${formatDate(new Date().toISOString())}`,
      pageWidth - marginX,
      13,
      { align: 'right' },
    )

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)
    doc.text(
      `Respuestas: ${stats.total}     Si asisten: ${stats.attendingChurches}     No asisten: ${stats.notAttendingChurches}     Jovenes estimados: ${stats.estimatedYouth}`,
      marginX,
      36,
    )

    autoTable(doc, {
      startY: 42,
      head: [['Fecha', 'Iglesia', 'Asiste', 'Jovenes']],
      body: filteredConfirmations.map((confirmation) => [
        formatDate(confirmation.createdAt),
        confirmation.churchName,
        confirmation.willAttend === 'yes' ? 'Si' : 'No',
        String(confirmation.estimatedYouth),
      ]),
      styles: { fontSize: 9, cellPadding: 3, valign: 'middle' },
      headStyles: {
        fillColor: [200, 15, 44],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 247] },
      columnStyles: {
        2: { halign: 'center', cellWidth: 22 },
        3: { halign: 'center', cellWidth: 24 },
      },
      margin: { left: marginX, right: marginX },
    })

    const pageCount = doc.getNumberOfPages()
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Pagina ${page} de ${pageCount}`,
        pageWidth - marginX,
        pageHeight - 8,
        { align: 'right' },
      )
    }

    doc.save(
      `confirmaciones-jovenes55-${new Date().toISOString().slice(0, 10)}.pdf`,
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-card bg-ink-quaternary/20" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-card bg-ink-quaternary/20"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-card bg-ink-quaternary/20" />
      </div>
    )
  }

  const tarjetas = [
    { valor: stats.total, label: 'Respuestas', icon: 'fas fa-church' },
    { valor: stats.attendingChurches, label: 'Sí asisten', icon: 'fas fa-check' },
    { valor: stats.notAttendingChurches, label: 'No asisten', icon: 'fas fa-xmark' },
    { valor: stats.estimatedYouth, label: 'Jóvenes estimados', icon: 'fas fa-users' },
  ]

  return (
    <>
      <header className="mb-8">
        <p className="section-subtitle">Aniversario 55</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="type-title-1 text-dark mb-0">Confirmaciones</h1>
            <p className="type-footnote text-ink-tertiary mt-1">
              Última respuesta: {formatDate(stats.latestAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchConfirmations}
              disabled={actualizando}
              className="btn-ghost disabled:opacity-60"
            >
              <i className={`fas fa-rotate ${actualizando ? 'fa-spin' : ''}`}></i>
              Actualizar
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filteredConfirmations.length === 0}
              className="btn-ghost disabled:opacity-40"
            >
              <i className="fas fa-file-csv"></i> CSV
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={filteredConfirmations.length === 0}
              className="btn-primary disabled:opacity-40"
            >
              <i className="fas fa-file-pdf"></i> PDF
            </button>
          </div>
        </div>
      </header>

      {error && (
        <p
          role="alert"
          className="mb-8 flex items-center gap-2 rounded-control bg-primary-tint px-4 py-3 type-footnote text-primary-dark animate-rise-in"
        >
          <i className="fas fa-circle-exclamation"></i>
          {error}
        </p>
      )}

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Los controles viven junto a la lista que filtran */}
      <div className="card mb-6 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="relative">
            <i className="fas fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary"></i>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field pl-11"
              placeholder="Buscar iglesia…"
              aria-label="Buscar iglesia"
            />
          </div>
          <div
            role="tablist"
            aria-label="Filtrar por asistencia"
            className="flex gap-2"
          >
            {filtrosAsistencia.map((f) => {
              const activo = attendanceFilter === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  onPointerDown={() => setAttendanceFilter(f.key)}
                  onClick={() => setAttendanceFilter(f.key)}
                  className={`pressable rounded-full px-4 py-2 type-footnote font-medium ${
                    activo
                      ? 'bg-dark text-white shadow-raised'
                      : 'bg-canvas-sunken text-ink-secondary hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="card">
        {filteredConfirmations.length === 0 ? (
          <div className="p-16 text-center">
            <i className="fas fa-inbox mb-4 block text-3xl text-ink-quaternary"></i>
            <h2 className="type-title-3 text-dark">
              {confirmations.length === 0
                ? 'Todavía no hay confirmaciones'
                : 'Sin resultados para este filtro'}
            </h2>
            <p className="type-footnote text-ink-secondary mt-1">
              {confirmations.length === 0
                ? 'Las respuestas aparecerán aquí apenas lleguen.'
                : 'Prueba con otro texto o quita el filtro.'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-separator bg-canvas-sunken">
                    {['Fecha', 'Iglesia', 'Asiste', 'Jóvenes', ''].map((h, i) => (
                      <th
                        key={h || i}
                        className={`px-6 py-3.5 type-caption font-semibold uppercase tracking-[0.06em] text-ink-tertiary ${
                          i === 4 ? 'text-right' : 'text-left'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredConfirmations.map((confirmation) => (
                    <tr
                      key={confirmation._id}
                      className="border-b border-separator last:border-0 hover:bg-canvas-sunken"
                    >
                      <td className="px-6 py-4 type-footnote text-ink-secondary">
                        {formatDate(confirmation.createdAt)}
                      </td>
                      <td className="px-6 py-4 type-footnote font-semibold text-dark">
                        {confirmation.churchName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 type-caption font-medium ${
                            confirmation.willAttend === 'yes'
                              ? 'bg-success-tint text-success'
                              : 'bg-ink-quaternary/25 text-ink-tertiary'
                          }`}
                        >
                          {confirmation.willAttend === 'yes' ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 type-footnote text-ink-secondary">
                        {confirmation.estimatedYouth}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setPorEliminar(confirmation)}
                          aria-label={`Eliminar confirmación de ${confirmation.churchName}`}
                          className="pressable inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-tint text-primary"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-separator md:hidden">
              {filteredConfirmations.map((confirmation) => (
                <li key={confirmation._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="type-footnote font-semibold text-dark">
                        {confirmation.churchName}
                      </p>
                      <p className="type-caption text-ink-tertiary mt-0.5">
                        {formatDate(confirmation.createdAt)} ·{' '}
                        {confirmation.estimatedYouth} jóvenes
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 type-caption font-medium ${
                        confirmation.willAttend === 'yes'
                          ? 'bg-success-tint text-success'
                          : 'bg-ink-quaternary/25 text-ink-tertiary'
                      }`}
                    >
                      {confirmation.willAttend === 'yes' ? 'Sí' : 'No'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPorEliminar(confirmation)}
                    className="pressable mt-3 rounded-full bg-primary-tint px-4 py-1.5 type-caption font-medium text-primary"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <ConfirmDialog
        open={porEliminar !== null}
        title="Eliminar confirmación"
        message={`Se eliminará la confirmación de “${porEliminar?.churchName ?? ''}” y se descontará de las estadísticas. Esta acción no se puede deshacer.`}
        loading={eliminando}
        onConfirm={confirmarEliminacion}
        onCancel={() => setPorEliminar(null)}
      />
    </>
  )
}
