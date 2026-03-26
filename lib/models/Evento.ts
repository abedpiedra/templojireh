import mongoose, { Schema, Document } from 'mongoose'

export interface IEvento extends Document {
  titulo: string
  fecha: Date
  hora: string
  lugar: string
  descripcion: string
  imagen?: string
  createdAt: Date
  updatedAt: Date
}

const EventoSchema = new Schema<IEvento>(
  {
    titulo: { type: String, required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    lugar: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Evento || mongoose.model<IEvento>('Evento', EventoSchema)
