import mongoose, { Schema, Document } from 'mongoose'

export interface IBlogPost extends Document {
  titulo: string
  slug: string
  fecha: Date
  categoria: string
  autor: string
  excerpt: string
  contenido: string
  imagen?: string
  publicado: boolean
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    titulo: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    fecha: { type: Date, required: true },
    categoria: { type: String, required: true },
    autor: { type: String, required: true, default: 'Pastor Luis Luengo' },
    excerpt: { type: String, required: true },
    contenido: { type: String },
    imagen: { type: String },
    publicado: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

// Generar slug automáticamente
BlogPostSchema.pre('save', function (next) {
  if (this.isModified('titulo') || !this.slug) {
    this.slug = this.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
