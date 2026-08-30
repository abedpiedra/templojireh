'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import EstadoVacio from '@/components/EstadoVacio'

interface User {
  _id: string
  nombre: string
  email: string
  rol: string
  activo: boolean
  createdAt: string
}

const FORM_VACIO = {
  nombre: '',
  email: '',
  password: '',
  rol: 'admin',
  activo: true,
}

export default function AdminUsuariosPage() {
  const { status } = useSession()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [porEliminar, setPorEliminar] = useState<User | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [formData, setFormData] = useState(FORM_VACIO)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const fetchUsuarios = useCallback(async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsuarios()
    }
  }, [status, fetchUsuarios])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!editingUser && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setGuardando(true)
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
        setError(data.error || 'No se pudo guardar.')
        return
      }

      await fetchUsuarios()
      closeModal()
    } catch (error) {
      setError('Error de conexión.')
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!porEliminar) return
    setEliminando(true)
    try {
      const res = await fetch(`/api/users/${porEliminar._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        // El aviso queda en la pagina, junto a la lista que no cambio
        setAviso(data.error || 'No se pudo eliminar el usuario.')
        return
      }

      setAviso('')
      await fetchUsuarios()
    } catch (error) {
      setAviso('Error de conexión al eliminar.')
    } finally {
      setEliminando(false)
      setPorEliminar(null)
    }
  }

  const toggleActivo = async (user: User) => {
    // Cambio optimista: el interruptor responde al instante
    setUsuarios((lista) =>
      lista.map((u) => (u._id === user._id ? { ...u, activo: !u.activo } : u)),
    )
    try {
      await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, activo: !user.activo }),
      })
      await fetchUsuarios()
    } catch (error) {
      console.error('Error:', error)
      await fetchUsuarios()
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
    setFormData(FORM_VACIO)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-card bg-fill/20" />
        <div className="h-72 animate-pulse rounded-card bg-fill/20" />
      </div>
    )
  }

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-subtitle">Acceso</p>
          <h1 className="type-title-1 text-ink mb-0">Usuarios</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <i className="fas fa-plus"></i> Agregar usuario
        </button>
      </header>

      {aviso && (
        <p
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-control bg-primary-tint px-4 py-3 type-footnote text-primary-dark animate-rise-in"
        >
          <i className="fas fa-circle-exclamation"></i>
          {aviso}
        </p>
      )}

      <div className="card">
        {usuarios.length === 0 ? (
          <EstadoVacio
            icono="fas fa-users"
            titulo="Todavía no hay usuarios"
            texto="Agrega el primero con el botón de arriba."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-separator bg-canvas-sunken">
                    {['Nombre', 'Email', 'Rol', 'Estado', 'Acciones'].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-left type-caption font-semibold uppercase tracking-[0.06em] text-ink-tertiary"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-separator last:border-0 hover:bg-canvas-sunken"
                    >
                      <td className="px-6 py-4 type-footnote font-semibold text-ink">
                        {user.nombre}
                      </td>
                      <td className="px-6 py-4 type-footnote text-ink-secondary">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-fill/20 px-3 py-1 type-caption font-medium text-ink-secondary">
                          {user.rol === 'admin' ? 'Administrador' : 'Editor'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => toggleActivo(user)}
                          aria-pressed={user.activo}
                          className={`pressable rounded-full px-3 py-1 type-caption font-medium ${
                            user.activo
                              ? 'bg-success-tint text-success'
                              : 'bg-fill/25 text-ink-tertiary'
                          }`}
                        >
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            aria-label={`Editar ${user.nombre}`}
                            className="pressable flex h-9 w-9 items-center justify-center rounded-full bg-fill/20 text-ink-secondary hover:text-ink"
                          >
                            <i className="fas fa-pen text-xs"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPorEliminar(user)}
                            aria-label={`Eliminar ${user.nombre}`}
                            className="pressable flex h-9 w-9 items-center justify-center rounded-full bg-primary-tint text-primary"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-separator md:hidden">
              {usuarios.map((user) => (
                <li key={user._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="type-footnote font-semibold text-ink">
                        {user.nombre}
                      </p>
                      <p className="type-caption text-ink-tertiary mt-0.5 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleActivo(user)}
                      aria-pressed={user.activo}
                      className={`pressable shrink-0 rounded-full px-3 py-1 type-caption font-medium ${
                        user.activo
                          ? 'bg-success-tint text-success'
                          : 'bg-fill/25 text-ink-tertiary'
                      }`}
                    >
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-fill/20 px-3 py-1 type-caption text-ink-secondary">
                      {user.rol === 'admin' ? 'Administrador' : 'Editor'}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      className="pressable rounded-full bg-fill/20 px-4 py-1.5 type-caption font-medium text-ink"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPorEliminar(user)}
                      className="pressable rounded-full bg-primary-tint px-4 py-1.5 type-caption font-medium text-primary"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingUser ? 'Editar usuario' : 'Agregar usuario'}
      >
        {error && (
          <p
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-control bg-primary-tint px-4 py-3 type-footnote text-primary-dark"
          >
            <i className="fas fa-circle-exclamation"></i>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="field"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="field"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="password">
              Contraseña{' '}
              {editingUser && (
                <span className="font-normal text-ink-tertiary">
                  (déjala vacía para no cambiarla)
                </span>
              )}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="field"
              placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
              required={!editingUser}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="rol">
              Rol
            </label>
            <select
              id="rol"
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              className="field"
            >
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="btn-primary disabled:opacity-60"
            >
              {guardando ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Guardando…
                </>
              ) : (
                'Guardar usuario'
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={porEliminar !== null}
        title="Eliminar usuario"
        message={`Se eliminará la cuenta de ${porEliminar?.nombre ?? ''} y perderá el acceso al panel. Esta acción no se puede deshacer.`}
        loading={eliminando}
        onConfirm={confirmarEliminacion}
        onCancel={() => setPorEliminar(null)}
      />
    </>
  )
}
