import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import connectDB from '@/lib/mongodb'
import Sermon from '@/lib/models/Sermon'
import Evento from '@/lib/models/Evento'

async function getData() {
  try {
    await connectDB()
    const sermones = await Sermon.find({}).sort({ fecha: -1 }).limit(3).lean()
    const eventos = await Evento.find({}).sort({ fecha: 1 }).limit(3).lean()
    return {
      sermones: JSON.parse(JSON.stringify(sermones)),
      eventos: JSON.parse(JSON.stringify(eventos)),
    }
  } catch (error) {
    return { sermones: [], eventos: [] }
  }
}

export default async function HomePage() {
  const { sermones, eventos } = await getData()

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 to-dark/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Bienvenidos a<br /><span className="text-primary">Templo Jireh</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Un lugar donde encontrarás esperanza, fe y una familia que te espera con los brazos abiertos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/nosotros" className="btn-primary">Conócenos</Link>
              <Link href="/sermones" className="btn-outline">Ver Sermones</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="bg-primary -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4">
            {[
              { icon: 'fa-sun', title: 'Servicio Dominical', time: 'Domingos 10:00 AM' },
              { icon: 'fa-book-bible', title: 'Estudio Bíblico', time: 'Miércoles 7:00 PM' },
              { icon: 'fa-praying-hands', title: 'Oración', time: 'Viernes 7:00 PM' },
              { icon: 'fa-users', title: 'Jóvenes', time: 'Sábados 6:00 PM' },
            ].map((item, i) => (
              <div key={i} className="text-white text-center py-10 px-6 border-r border-white/20 last:border-r-0 hover:bg-black/10 transition-colors">
                <i className={`fas ${item.icon} text-4xl mb-4`}></i>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm opacity-90">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800"
                alt="Templo Jireh"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="section-subtitle">Sobre Nosotros</p>
              <h2 className="section-title">Una Iglesia con Propósito</h2>
              <p className="text-gray-600 mb-4">
                Templo Jireh es una comunidad de fe comprometida con el crecimiento espiritual
                y el servicio a nuestra comunidad. Bajo el liderazgo del Pastor Luis Luengo,
                trabajamos juntos para llevar el mensaje de esperanza y salvación.
              </p>
              <ul className="space-y-3 mb-6">
                {['Predicación basada en la Biblia', 'Comunidad acogedora', 'Ministerios para todas las edades', 'Compromiso con la comunidad'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <i className="fas fa-check-circle text-secondary mr-3"></i> {item}
                  </li>
                ))}
              </ul>
              <Link href="/nosotros" className="btn-primary">Conocer Más</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pastor Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-subtitle">Nuestro Pastor</p>
              <h2 className="section-title">Pastor Luis Luengo</h2>
              <p className="text-gray-600 mb-4">
                Con más de 20 años de ministerio, el Pastor Luis Luengo ha dedicado su vida
                a servir a Dios y a guiar a su congregación en el camino de la fe.
              </p>
              <blockquote className="bg-gray-50 p-6 border-l-4 border-primary italic text-gray-600 mt-6">
                <i className="fas fa-quote-left text-primary mr-2"></i>
                "Nuestra misión es ser una iglesia que transforma vidas a través del amor de Cristo."
              </blockquote>
            </div>
            <div className="relative h-[450px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"
                alt="Pastor Luis Luengo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Lo Que Hacemos</p>
            <h2 className="section-title">Nuestros Ministerios</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-child', title: 'Iglesia de Niños', desc: 'Enseñamos a los más pequeños el amor de Dios de manera divertida.' },
              { icon: 'fa-users', title: 'Jóvenes', desc: 'Un espacio para crecer en fe y desarrollar relaciones significativas.' },
              { icon: 'fa-heart', title: 'Dorcas', desc: 'Ministerio de mujeres dedicado al servicio y apoyo comunitario.' },
              { icon: 'fa-music', title: 'Adoración', desc: 'Guiamos a la congregación en alabanza y adoración.' },
              { icon: 'fa-hands-helping', title: 'Voluntarios', desc: 'Servimos a nuestra comunidad con amor y dedicación.' },
              { icon: 'fa-home', title: 'Grupos de Casa', desc: 'Comunidades pequeñas donde crecemos juntos en fe.' },
            ].map((item, i) => (
              <div key={i} className="card p-8 text-center hover:shadow-xl">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <i className={`fas ${item.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Palabra de Dios</p>
            <h2 className="section-title">Últimos Sermones</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(sermones.length > 0 ? sermones : [
              { titulo: 'La Fe que Mueve Montañas', fecha: '2024-03-25', predicador: 'Pastor Luis Luengo', imagen: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600' },
              { titulo: 'El Poder de la Oración', fecha: '2024-03-18', predicador: 'Pastor Luis Luengo', imagen: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600' },
              { titulo: 'Viviendo en Gracia', fecha: '2024-03-11', predicador: 'Pastor Luis Luengo', imagen: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600' },
            ]).map((sermon: any, i: number) => (
              <div key={i} className="card group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={sermon.imagen || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600'}
                    alt={sermon.titulo}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-primary text-sm mb-2">
                    {new Date(sermon.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="font-semibold text-lg text-dark mb-1">{sermon.titulo}</h3>
                  <p className="text-gray-500 text-sm">{sermon.predicador}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/sermones" className="btn-primary">Ver Todos los Sermones</Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Calendario</p>
            <h2 className="section-title">Próximos Eventos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(eventos.length > 0 ? eventos : [
              { titulo: 'Conferencia de Mujeres', fecha: '2024-03-30', hora: '9:00 AM - 5:00 PM', lugar: 'Templo Jireh' },
              { titulo: 'Retiro de Jóvenes', fecha: '2024-04-05', hora: 'Viernes a Domingo', lugar: 'Campamento' },
              { titulo: 'Bautizos', fecha: '2024-04-14', hora: '11:00 AM', lugar: 'Templo Jireh' },
            ]).map((evento: any, i: number) => {
              const fecha = new Date(evento.fecha)
              return (
                <div key={i} className="card p-6 flex gap-5">
                  <div className="bg-primary text-white px-4 py-3 rounded-lg text-center flex-shrink-0">
                    <span className="text-2xl font-bold block">{fecha.getDate()}</span>
                    <span className="text-xs uppercase">{fecha.toLocaleDateString('es-ES', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-2">{evento.titulo}</h3>
                    <p className="text-gray-500 text-sm"><i className="fas fa-clock text-primary mr-1"></i> {evento.hora}</p>
                    <p className="text-gray-500 text-sm"><i className="fas fa-map-marker-alt text-primary mr-1"></i> {evento.lugar}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/eventos" className="btn-primary">Ver Todos los Eventos</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-dark to-dark-light text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Primera Vez en Templo Jireh?</h2>
          <p className="text-xl text-gray-300 mb-8">Te invitamos a ser parte de nuestra familia. Ven y experimenta el amor de Dios.</p>
          <Link href="/contacto" className="inline-block px-8 py-4 bg-white text-dark font-semibold rounded-md hover:bg-primary hover:text-white transition-colors">
            Planifica tu Visita
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
