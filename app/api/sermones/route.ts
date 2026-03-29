import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Sermon from '@/lib/models/Sermon'

// Schema de validación para sermones
const SermonSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(200),
  fecha: z.string().or(z.date()),
  categoria: z.string().min(1, 'La categoría es requerida'),
  predicador: z.string().min(1, 'El predicador es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  imagen: z.string().url().optional().or(z.literal('')),
  video: z.string().url().optional().or(z.literal('')),
  audio: z.string().url().optional().or(z.literal('')),
})

// GET - Obtener todos los sermones (público)
export async function GET() {
  try {
    await connectDB()
    const sermones = await Sermon.find({}).sort({ fecha: -1 })
    return NextResponse.json(sermones)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener sermones' }, { status: 500 })
  }
}

// POST - Crear nuevo sermón (protegido)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectDB()
    const data = await request.json()

    // Validar datos
    const validationResult = SermonSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: validationResult.error.issues
      }, { status: 400 })
    }

    const sermon = await Sermon.create(validationResult.data)
    return NextResponse.json(sermon, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear sermón' }, { status: 500 })
  }
}
