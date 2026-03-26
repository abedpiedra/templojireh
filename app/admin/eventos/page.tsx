'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'

interface Evento {
  _id: string
  titulo: string
  fecha: string
  hora: string
  lugar: string
  descripcion: string
  imagen?: string
}

function AdminEventosContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    lugar: '',
    descripcion: '',
    imagen: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowModal(true)
    }
  }, [searchParams])

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      const res = await fetch('/api/eventos')
      const data = await res.json()
      setEventos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingEvento ? `/api/eventos/${editingEvento._id}` : '/api/eventos'
      const method = editingEvento ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchEventos()
        closeModal()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await fetch(`/api/eventos/${id}`, { method: 'DELETE' })
        fetchEventos()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const openEdit = (evento: Evento) => {
    setEditingEvento(evento)
    setFormData({
      titulo: evento.titulo,
      fecha: evento.fecha.split('T')[0],
      hora: evento.hora,
      lugar: evento.lugar,
      descripcion: evento.descripcion,
      imagen: evento.imagen || '',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEvento(null)
    setFormData({ titulo: '', fecha: '', hora: '', lugar: '', descripcion: '', imagen: '' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">Templo <span className="text-primary">Jireh</span></h1>
          <p className="text-gray-500 text-sm mt-1">Panel Admin</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5"><i className="fas fa-home w-5"></i> Dashboard</Link>
          <Link href="/admin/sermones" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5"><i className="fas fa-bible w-5"></i> Sermones</Link>
          <Link href="/admin/eventos" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-primary"><i className="fas fa-calendar-alt w-5"></i> Eventos</Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5"><i className="fas fa-newspaper w-5"></i> Blog</Link>
          <Link href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5"><i className="fas fa-users w-5"></i> Usuarios</Link>
          <div className="border-t border-white/10 my-4"></div>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5"><i className="fas fa-globe w-5"></i> Ver Sitio</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-dark"><i className="fas fa-calendar-alt text-primary mr-3"></i>Gestión de Eventos</h2>
            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <i className="fas fa-plus mr-2"></i> Agregar Evento
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {eventos.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <i className="fas fa-calendar-alt text-6xl mb-4 text-gray-300"></i>
              <h3 className="text-xl font-semibold mb-2">No hay eventos</h3>
              <p>Agrega tu primer evento usando el botón de arriba</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Imagen</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Título</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Hora</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Lugar</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4"><img src={evento.imagen || 'https://via.placeholder.com/60x40'} alt={evento.titulo} className="w-16 h-10 object-cover rounded" /></td>
                    <td className="px-6 py-4 font-medium text-dark">{evento.titulo}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(evento.fecha).toLocaleDateString('es-ES')}</td>
                    <td className="px-6 py-4 text-gray-600">{evento.hora}</td>
                    <td className="px-6 py-4 text-gray-600">{evento.lugar}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(evento)} className="px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleDelete(evento._id)} className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-dark"><i className="fas fa-calendar-alt text-primary mr-2"></i>{editingEvento ? 'Editar Evento' : 'Agregar Evento'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Título</label>
                <input type="text" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Fecha</label>
                  <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Hora</label>
                  <input type="text" value={formData.hora} onChange={(e) => setFormData({ ...formData, hora: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" placeholder="Ej: 9:00 AM - 5:00 PM" required />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Lugar</label>
                <input type="text" value={formData.lugar} onChange={(e) => setFormData({ ...formData, lugar: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none" rows={3} required></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">URL de Imagen</label>
                <input type="url" value={formData.imagen} onChange={(e) => setFormData({ ...formData, imagen: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" placeholder="https://..." />
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"><i className="fas fa-save mr-2"></i> Guardar Evento</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminEventosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><i className="fas fa-spinner fa-spin text-4xl text-primary"></i></div>}>
      <AdminEventosContent />
    </Suspense>
  )
}
