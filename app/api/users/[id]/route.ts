import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

// PUT /api/users/[id] - Actualizar usuario
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectDB()
    const { nombre, email, password, rol, activo } = await request.json()

    const updateData: any = { nombre, email, rol, activo }

    // Solo actualizar password si se proporciona uno nuevo
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Eliminar usuario
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectDB()

    // Verificar que no sea el último admin activo
    const adminCount = await User.countDocuments({ rol: 'admin', activo: true })
    const userToDelete = await User.findById(params.id)

    if (userToDelete?.rol === 'admin' && adminCount <= 1) {
      return NextResponse.json(
        { error: 'No puedes eliminar el último administrador' },
        { status: 400 }
      )
    }

    await User.findByIdAndDelete(params.id)

    return NextResponse.json({ message: 'Usuario eliminado' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 })
  }
}
