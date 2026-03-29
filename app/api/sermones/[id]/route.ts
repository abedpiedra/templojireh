import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Sermon from '@/lib/models/Sermon'

// Schema de validación para actualizar sermones
const SermonUpdateSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  fecha: z.string().or(z.date()).optional(),
  categoria: z.string().min(1).optional(),
  predicador: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  imagen: z.string().url().optional().or(z.literal('')),
  video: z.string().url().optional().or(z.literal('')),
  audio: z.string().url().optional().or(z.literal('')),
})

// Validar que el ID sea un ObjectId válido de MongoDB
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)

// GET - Obtener un sermón por ID (público)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    await connectDB()
    const sermon = await Sermon.findById(params.id)
    if (!sermon) {
      return NextResponse.json({ error: 'Sermón no encontrado' }, { status: 404 })
    }
    return NextResponse.json(sermon)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener sermón' }, { status: 500 })
  }
}

// PUT - Actualizar sermón (protegido)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    await connectDB()
    const data = await request.json()

    // Validar datos
    const validationResult = SermonUpdateSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: validationResult.error.issues
      }, { status: 400 })
    }

    const sermon = await Sermon.findByIdAndUpdate(params.id, validationResult.data, { new: true })
    if (!sermon) {
      return NextResponse.json({ error: 'Sermón no encontrado' }, { status: 404 })
    }
    return NextResponse.json(sermon)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar sermón' }, { status: 500 })
  }
}

// DELETE - Eliminar sermón (protegido)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    await connectDB()
    const sermon = await Sermon.findByIdAndDelete(params.id)
    if (!sermon) {
      return NextResponse.json({ error: 'Sermón no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Sermón eliminado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar sermón' }, { status: 500 })
  }
}
