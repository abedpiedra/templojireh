'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

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
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [attendanceFilter, setAttendanceFilter] = useState<
    'all' | AttendanceValue
  >('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConfirmations()
    }
  }, [status])

  const fetchConfirmations = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/invitacion-jovenes55/confirmaciones', {
        cache: 'no-store',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al cargar confirmaciones')
        return
      }

      setConfirmations(Array.isArray(data.confirmations) ? data.confirmations : [])
      setStats(data.stats || emptyStats)
    } catch (error) {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }

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

  const handleDelete = async (confirmation: Confirmation) => {
    const warning =
      `Vas a eliminar la confirmacion de "${confirmation.churchName}".\n\n` +
      'Esta accion es permanente y no se puede deshacer. ' +
      'El registro se descontara de las estadisticas.\n\n' +
      'Estas seguro de que deseas continuar?'

    if (!confirm(warning)) {
      return
    }

    setDeletingId(confirmation._id)
    setError('')

    try {
      const res = await fetch(
        `/api/invitacion-jovenes55/confirmaciones/${confirmation._id}`,
        { method: 'DELETE' },
      )
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'Error al eliminar la confirmacion')
        return
      }

      await fetchConfirmations()
    } catch (error) {
      setError('Error de conexion')
    } finally {
      setDeletingId(null)
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
    const blob = new Blob([`\uFEFF${csv}`], {
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

    // Encabezado de marca
    doc.setFillColor(26, 26, 46) // dark
    doc.rect(0, 0, pageWidth, 26, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('Templo Jireh', marginX, 13)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(209, 79, 66) // primary
    doc.text('Confirmaciones Jovenes 55', marginX, 20)

    doc.setTextColor(200, 200, 200)
    doc.setFontSize(9)
    doc.text(
      `Generado: ${formatDate(new Date().toISOString())}`,
      pageWidth - marginX,
      13,
      { align: 'right' },
    )

    // Resumen
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)
    doc.text(
      `Respuestas: ${stats.total}     Si asisten: ${stats.attendingChurches}     No asisten: ${stats.notAttendingChurches}     Jovenes estimados: ${stats.estimatedYouth}`,
      marginX,
      36,
    )

    // Tabla tipo lista
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
        fillColor: [209, 79, 66],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [247, 247, 247] },
      columnStyles: {
        2: { halign: 'center', cellWidth: 22 },
        3: { halign: 'center', cellWidth: 24 },
      },
      margin: { left: marginX, right: marginX },
    })

    // Pie de pagina con numeracion
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-dark">
              <i className="fas fa-clipboard-check text-primary mr-3"></i>
              Confirmaciones Jovenes 55
            </h2>
            <p className="text-gray-500 mt-1">
              Ultima respuesta: {formatDate(stats.latestAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchConfirmations}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-sync mr-2"></i> Actualizar
            </button>
            <button
              onClick={exportCsv}
              disabled={filteredConfirmations.length === 0}
              className="px-5 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-file-csv mr-2"></i> Exportar CSV
            </button>
            <button
              onClick={exportPdf}
              disabled={filteredConfirmations.length === 0}
              className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-file-pdf mr-2"></i> Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-8">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      ) : null}

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4">
            <i className="fas fa-church"></i>
          </div>
          <h3 className="text-3xl font-bold text-dark">{stats.total}</h3>
          <p className="text-gray-500">Respuestas</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl mb-4">
            <i className="fas fa-check"></i>
          </div>
          <h3 className="text-3xl font-bold text-dark">
            {stats.attendingChurches}
          </h3>
          <p className="text-gray-500">Si asisten</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xl mb-4">
            <i className="fas fa-times"></i>
          </div>
          <h3 className="text-3xl font-bold text-dark">
            {stats.notAttendingChurches}
          </h3>
          <p className="text-gray-500">No asisten</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4">
            <i className="fas fa-users"></i>
          </div>
          <h3 className="text-3xl font-bold text-dark">
            {stats.estimatedYouth}
          </h3>
          <p className="text-gray-500">Jovenes estimados</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Buscar iglesia..."
            />
          </div>
          <select
            value={attendanceFilter}
            onChange={(event) =>
              setAttendanceFilter(event.target.value as 'all' | AttendanceValue)
            }
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="all">Todas</option>
            <option value="yes">Si asisten</option>
            <option value="no">No asisten</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredConfirmations.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <i className="fas fa-inbox text-6xl mb-4 text-gray-300"></i>
            <h3 className="text-xl font-semibold mb-2">No hay confirmaciones</h3>
            <p>Las respuestas apareceran en esta tabla.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                    Iglesia
                  </th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                    Asiste
                  </th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                    Jovenes
                  </th>
                  <th className="px-6 py-4 text-right text-gray-600 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredConfirmations.map((confirmation) => (
                  <tr key={confirmation._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(confirmation.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-dark">
                      {confirmation.churchName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          confirmation.willAttend === 'yes'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {confirmation.willAttend === 'yes' ? 'Si' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {confirmation.estimatedYouth}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(confirmation)}
                        disabled={deletingId === confirmation._id}
                        title="Eliminar confirmacion"
                        aria-label={`Eliminar confirmacion de ${confirmation.churchName}`}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === confirmation._id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
