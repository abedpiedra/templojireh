import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor',
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
