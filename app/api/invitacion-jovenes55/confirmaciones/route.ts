import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import YouthInvitationConfirmation from '@/lib/models/YouthInvitationConfirmation'

export const dynamic = 'force-dynamic'

const ConfirmationSchema = z
  .object({
    churchName: z
      .string()
      .trim()
      .min(2, 'El nombre de la iglesia es requerido')
      .max(140, 'El nombre de la iglesia es demasiado largo'),
    willAttend: z.enum(['yes', 'no']),
    estimatedYouth: z.coerce.number().int().min(0).max(999).default(0),
  })
  .superRefine((data, context) => {
    if (data.willAttend === 'yes' && data.estimatedYouth <= 0) {
      context.addIssue({
        code: 'custom',
        path: ['estimatedYouth'],
        message: 'Ingresa un estimado de jovenes mayor a 0',
      })
    }
  })

function serializeConfirmation(confirmation: any) {
  return {
    _id: confirmation._id.toString(),
    churchName: confirmation.churchName,
    willAttend: confirmation.willAttend,
    estimatedYouth: confirmation.estimatedYouth,
    createdAt: confirmation.createdAt?.toISOString(),
    updatedAt: confirmation.updatedAt?.toISOString(),
  }
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim()
  }

  return request.headers.get('x-real-ip') || undefined
}

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectDB()
    const confirmations = await YouthInvitationConfirmation.find({})
      .sort({ createdAt: -1 })
      .lean()

    const serialized = confirmations.map(serializeConfirmation)
    const attending = serialized.filter(
      (confirmation) => confirmation.willAttend === 'yes',
    )
    const notAttending = serialized.filter(
      (confirmation) => confirmation.willAttend === 'no',
    )

    return NextResponse.json(
      {
        confirmations: serialized,
        stats: {
          total: serialized.length,
          attendingChurches: attending.length,
          notAttendingChurches: notAttending.length,
          estimatedYouth: attending.reduce(
            (total, confirmation) => total + confirmation.estimatedYouth,
            0,
          ),
          latestAt: serialized[0]?.createdAt || null,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching youth invitation confirmations:', error)
    return NextResponse.json(
      { error: 'Error al obtener confirmaciones' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const validationResult = ConfirmationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Datos invalidos',
          details: validationResult.error.issues,
        },
        { status: 400 },
      )
    }

    const { churchName, willAttend } = validationResult.data
    const estimatedYouth =
      willAttend === 'no' ? 0 : validationResult.data.estimatedYouth

    await connectDB()
    const confirmation = await YouthInvitationConfirmation.create({
      churchName,
      willAttend,
      estimatedYouth,
      ipAddress: getClientIp(request),
      userAgent: request.headers.get('user-agent')?.slice(0, 300),
    })

    return NextResponse.json(
      {
        message: 'Confirmacion recibida',
        confirmation: serializeConfirmation(confirmation),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating youth invitation confirmation:', error)
    return NextResponse.json(
      { error: 'Error al guardar confirmacion' },
      { status: 500 },
    )
  }
}
