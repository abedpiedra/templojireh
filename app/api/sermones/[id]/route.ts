import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Sermon from '@/lib/models/Sermon'

// GET - Obtener un sermón por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

// PUT - Actualizar sermón
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const data = await request.json()
    const sermon = await Sermon.findByIdAndUpdate(params.id, data, { new: true })
    if (!sermon) {
      return NextResponse.json({ error: 'Sermón no encontrado' }, { status: 404 })
    }
    return NextResponse.json(sermon)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar sermón' }, { status: 500 })
  }
}

// DELETE - Eliminar sermón
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
