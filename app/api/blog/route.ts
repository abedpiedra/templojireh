import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'

// GET - Obtener todos los posts
export async function GET() {
  try {
    await connectDB()
    const posts = await BlogPost.find({ publicado: true }).sort({ fecha: -1 })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener posts' }, { status: 500 })
  }
}

// POST - Crear nuevo post
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()
    const post = await BlogPost.create(data)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear post' }, { status: 500 })
  }
}
