import mongoose, { Document, Model, Schema } from 'mongoose'

export type YouthInvitationAttendance = 'yes' | 'no'

export interface IYouthInvitationConfirmation extends Document {
  churchName: string
  willAttend: YouthInvitationAttendance
  estimatedYouth: number
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

const YouthInvitationConfirmationSchema =
  new Schema<IYouthInvitationConfirmation>(
    {
      churchName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 140,
      },
      willAttend: {
        type: String,
        enum: ['yes', 'no'],
        required: true,
      },
      estimatedYouth: {
        type: Number,
        required: true,
        min: 0,
        max: 999,
        default: 0,
      },
      ipAddress: {
        type: String,
        maxlength: 80,
      },
      userAgent: {
        type: String,
        maxlength: 300,
      },
    },
    {
      collection: 'invitacion_jovenes55_confirmaciones',
      timestamps: true,
    },
  )

YouthInvitationConfirmationSchema.index({ createdAt: -1 })
YouthInvitationConfirmationSchema.index({ willAttend: 1 })

const modelName = 'YouthInvitationConfirmation'

export default (mongoose.models[modelName] as
  | Model<IYouthInvitationConfirmation>
  | undefined) ||
  mongoose.model<IYouthInvitationConfirmation>(
    modelName,
    YouthInvitationConfirmationSchema,
  )
