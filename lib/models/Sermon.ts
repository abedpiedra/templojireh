import mongoose, { Schema, Document } from 'mongoose'

export interface ISermon extends Document {
  titulo: string
  fecha: Date
  categoria: string
  predicador: string
  descripcion: string
  imagen?: string
  video?: string
  audio?: string
  createdAt: Date
  updatedAt: Date
}

const SermonSchema = new Schema<ISermon>(
  {
    titulo: { type: String, required: true },
    fecha: { type: Date, required: true },
    categoria: { type: String, required: true },
    predicador: { type: String, required: true, default: 'Pastor Luis Luengo' },
    descripcion: { type: String, required: true },
    imagen: { type: String },
    video: { type: String },
    audio: { type: String },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Sermon || mongoose.model<ISermon>('Sermon', SermonSchema)
