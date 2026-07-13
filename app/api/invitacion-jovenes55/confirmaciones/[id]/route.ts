import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import YouthInvitationConfirmation from '@/lib/models/YouthInvitationConfirmation'

export const dynamic = 'force-dynamic'

// Validar que el ID sea un ObjectId valido de MongoDB
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)

// DELETE - Eliminar una confirmacion (protegido)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticacion
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'ID invalido' }, { status: 400 })
    }

    await connectDB()
    const confirmation = await YouthInvitationConfirmation.findByIdAndDelete(
      params.id,
    )

    if (!confirmation) {
      return NextResponse.json(
        { error: 'Confirmacion no encontrada' },
        { status: 404 },
      )
    }

    return NextResponse.json({ message: 'Confirmacion eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting youth invitation confirmation:', error)
    return NextResponse.json(
      { error: 'Error al eliminar confirmacion' },
      { status: 500 },
    )
  }
}
