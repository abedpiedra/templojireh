'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  _id: string
  nombre: string
  email: string
  rol: string
  activo: boolean
  createdAt: string
}

export default function AdminUsuariosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'admin',
    activo: true,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!editingUser && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al guardar')
        return
      }

      fetchUsuarios()
      closeModal()
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
        const data = await res.json()

        if (!res.ok) {
          alert(data.error)
          return
        }

        fetchUsuarios()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const toggleActivo = async (user: User) => {
    try {
      await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, activo: !user.activo }),
      })
      fetchUsuarios()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol,
      activo: user.activo,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setError('')
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'admin',
      activo: true,
    })
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
          <h1 className="text-xl font-bold text-white">
            Templo <span className="text-primary">Jireh</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Panel Admin</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <i className="fas fa-home w-5"></i> Dashboard
          </Link>
          <Link href="/admin/sermones" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <i className="fas fa-bible w-5"></i> Sermones
          </Link>
          <Link href="/admin/eventos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <i className="fas fa-calendar-alt w-5"></i> Eventos
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <i className="fas fa-newspaper w-5"></i> Blog
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-primary transition-colors">
            <i className="fas fa-users w-5"></i> Usuarios
          </Link>
          <div className="border-t border-white/10 my-4"></div>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <i className="fas fa-globe w-5"></i> Ver Sitio
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-dark">
              <i className="fas fa-users text-primary mr-3"></i>
              Gestión de Usuarios
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
            >
              <i className="fas fa-plus mr-2"></i> Agregar Usuario
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {usuarios.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <i className="fas fa-users text-6xl mb-4 text-gray-300"></i>
              <h3 className="text-xl font-semibold mb-2">No hay usuarios</h3>
              <p>Agrega tu primer usuario usando el botón de arriba</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Rol</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-dark">{user.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.rol === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActivo(user)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.activo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
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
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-dark">
                <i className="fas fa-user text-primary mr-2"></i>
                {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                &times;
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
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
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contraseña {editingUser && <span className="text-gray-400 text-sm">(dejar vacío para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-save mr-2"></i> Guardar Usuario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
