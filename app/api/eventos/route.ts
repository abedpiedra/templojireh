import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Evento from '@/lib/models/Evento'

// GET - Obtener todos los eventos
export async function GET() {
  try {
    await connectDB()
    const eventos = await Evento.find({}).sort({ fecha: 1 })
    return NextResponse.json(eventos)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 })
  }
}

// POST - Crear nuevo evento
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()
    const evento = await Evento.create(data)
    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 })
  }
}
