import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Evento from '@/lib/models/Evento'

// GET - Obtener un evento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const evento = await Evento.findById(params.id)
    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }
    return NextResponse.json(evento)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener evento' }, { status: 500 })
  }
}

// PUT - Actualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const data = await request.json()
    const evento = await Evento.findByIdAndUpdate(params.id, data, { new: true })
    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }
    return NextResponse.json(evento)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 })
  }
}

// DELETE - Eliminar evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const evento = await Evento.findByIdAndDelete(params.id)
    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Evento eliminado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 })
  }
}
