import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

// GET /api/users - Obtener todos los usuarios
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectDB()
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

// POST /api/users - Crear nuevo usuario
export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectDB()
    const { nombre, email, password, rol } = await request.json()

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'admin',
      activo: true,
    })

    return NextResponse.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}
