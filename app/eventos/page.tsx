import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import EventoCard from '@/components/EventoCard'
import connectDB from '@/lib/mongodb'
import Evento from '@/lib/models/Evento'

async function getEventos() {
  try {
    await connectDB()
    const eventos = await Evento.find({}).sort({ fecha: 1 }).lean()
    return JSON.parse(JSON.stringify(eventos))
  } catch (error) {
    return []
  }
}

export default async function EventosPage() {
  const eventos = await getEventos()

  // Datos de ejemplo si no hay eventos en la BD
  const eventosDefault = [
    { _id: '1', titulo: 'Conferencia de Mujeres 2024', fecha: '2024-03-30', hora: '9:00 AM - 5:00 PM', lugar: 'Templo Jireh', descripcion: 'Un día especial dedicado a las mujeres de nuestra congregación.', imagen: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600' },
    { _id: '2', titulo: 'Retiro de Jóvenes', fecha: '2024-04-05', hora: 'Viernes a Domingo', lugar: 'Campamento', descripcion: 'Un fin de semana de conexión con Dios y con otros jóvenes.', imagen: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600' },
    { _id: '3', titulo: 'Servicio de Bautismos', fecha: '2024-04-14', hora: '11:00 AM', lugar: 'Templo Jireh', descripcion: 'Celebramos junto a aquellos que han decidido dar el paso de fe.', imagen: 'https://images.unsplash.com/photo-1473172707857-f9e276582ab6?w=600' },
    { _id: '4', titulo: 'Día de la Familia', fecha: '2024-04-21', hora: '10:00 AM - 4:00 PM', lugar: 'Parque Central', descripcion: 'Un día especial para celebrar y fortalecer los lazos familiares.', imagen: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600' },
  ]

  const eventosToShow = eventos.length > 0 ? eventos : eventosDefault

  return (
    <>
      <Header />
      <PageHeader title="Eventos" breadcrumb="Eventos" />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Calendario</p>
            <h2 className="section-title">Próximos Eventos</h2>
          </div>

          <div className="space-y-8">
            {eventosToShow.map((evento: any) => (
              <EventoCard
                key={evento._id}
                titulo={evento.titulo}
                fecha={evento.fecha}
                hora={evento.hora}
                lugar={evento.lugar}
                descripcion={evento.descripcion}
                imagen={evento.imagen}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-dark to-dark-light text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Quieres Proponer un Evento?</h2>
          <p className="text-gray-300 mb-6">Si tienes una idea para un evento o ministerio, nos encantaría escucharte.</p>
          <a href="/contacto" className="inline-block px-8 py-4 bg-white text-dark font-semibold rounded-md hover:bg-primary hover:text-white transition-colors">
            Contáctanos
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
