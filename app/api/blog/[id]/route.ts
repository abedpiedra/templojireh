import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'

// GET - Obtener un post por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const post = await BlogPost.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener post' }, { status: 500 })
  }
}

// PUT - Actualizar post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const data = await request.json()
    const post = await BlogPost.findByIdAndUpdate(params.id, data, { new: true })
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar post' }, { status: 500 })
  }
}

// DELETE - Eliminar post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const post = await BlogPost.findByIdAndDelete(params.id)
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Post eliminado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar post' }, { status: 500 })
  }
}
