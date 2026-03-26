import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Sermon from '@/lib/models/Sermon'

// GET - Obtener todos los sermones
export async function GET() {
  try {
    await connectDB()
    const sermones = await Sermon.find({}).sort({ fecha: -1 })
    return NextResponse.json(sermones)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener sermones' }, { status: 500 })
  }
}

// POST - Crear nuevo sermón
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()
    const sermon = await Sermon.create(data)
    return NextResponse.json(sermon, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear sermón' }, { status: 500 })
  }
}
