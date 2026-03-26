import mongoose from 'mongoose'

const YouTubeVideoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export default mongoose.models.YouTubeVideo || mongoose.model('YouTubeVideo', YouTubeVideoSchema)
