import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import EventoCard from '@/components/EventoCard'
import connectDB from '@/lib/mongodb'
import Evento from '@/lib/models/Evento'

export const dynamic = 'force-dynamic'

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

          {eventos.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-calendar-alt text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">No hay eventos programados</p>
            </div>
          ) : (
            <div className="space-y-8">
              {eventos.map((evento: any) => (
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
          )}
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
