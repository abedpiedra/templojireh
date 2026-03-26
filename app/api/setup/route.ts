import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

// POST /api/setup - Crear primer usuario admin (solo si no existen usuarios)
export async function POST(request: Request) {
  try {
    await connectDB()

    // Verificar si ya existen usuarios
    const existingUsers = await User.countDocuments()
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: 'Ya existen usuarios. Use el panel de admin para crear más.' },
        { status: 400 }
      )
    }

    const { nombre, email, password } = await request.json()

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y password son requeridos' },
        { status: 400 }
      )
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario admin
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol: 'admin',
      activo: true,
    })

    return NextResponse.json({
      message: 'Usuario admin creado exitosamente',
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error en setup:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear usuario' },
      { status: 500 }
    )
  }
}

// GET /api/setup - Verificar si necesita setup
export async function GET() {
  try {
    await connectDB()
    const existingUsers = await User.countDocuments()

    return NextResponse.json({
      needsSetup: existingUsers === 0
    })
  } catch (error) {
    return NextResponse.json({ needsSetup: true })
  }
}
