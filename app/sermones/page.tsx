import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import SermonCard from '@/components/SermonCard'
import connectDB from '@/lib/mongodb'
import Sermon from '@/lib/models/Sermon'

async function getSermones() {
  try {
    await connectDB()
    const sermones = await Sermon.find({}).sort({ fecha: -1 }).lean()
    return JSON.parse(JSON.stringify(sermones))
  } catch (error) {
    return []
  }
}

export default async function SermonesPage() {
  const sermones = await getSermones()

  // Datos de ejemplo si no hay sermones en la BD
  const sermonesDefault = [
    { _id: '1', titulo: 'La Fe que Mueve Montañas', fecha: '2024-03-25', predicador: 'Pastor Luis Luengo', categoria: 'Fe', descripcion: 'Descubre cómo la fe genuina puede transformar las circunstancias más difíciles de tu vida.', imagen: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600' },
    { _id: '2', titulo: 'El Poder de la Oración', fecha: '2024-03-18', predicador: 'Pastor Luis Luengo', categoria: 'Oración', descripcion: 'La oración es nuestra conexión directa con el Padre celestial.', imagen: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600' },
    { _id: '3', titulo: 'Viviendo en Gracia', fecha: '2024-03-11', predicador: 'Pastor Luis Luengo', categoria: 'Enseñanza', descripcion: 'Entendiendo la gracia de Dios y cómo aplicarla en nuestra vida cotidiana.', imagen: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600' },
    { _id: '4', titulo: 'Fortaleciendo la Familia', fecha: '2024-03-04', predicador: 'Pastor Luis Luengo', categoria: 'Familia', descripcion: 'Principios bíblicos para construir hogares sólidos y familias unidas en Cristo.', imagen: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=600' },
  ]

  const sermonesToShow = sermones.length > 0 ? sermones : sermonesDefault

  return (
    <>
      <Header />
      <PageHeader title="Sermones" breadcrumb="Sermones" />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Todos', 'Fe', 'Familia', 'Oración', 'Adoración'].map((cat) => (
              <button
                key={cat}
                className="px-5 py-2 bg-white rounded-full text-sm text-gray-600 shadow hover:bg-primary hover:text-white transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sermons List */}
          <div className="grid lg:grid-cols-2 gap-8">
            {sermonesToShow.map((sermon: any) => (
              <SermonCard
                key={sermon._id}
                titulo={sermon.titulo}
                fecha={sermon.fecha}
                predicador={sermon.predicador}
                descripcion={sermon.descripcion}
                imagen={sermon.imagen}
                video={sermon.video}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-dark to-dark-light text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Te Perdiste un Servicio?</h2>
          <p className="text-gray-300 mb-6">Suscríbete a nuestro canal de YouTube para no perderte ningún sermón.</p>
          <a href="#" className="inline-block px-8 py-4 bg-white text-dark font-semibold rounded-md hover:bg-primary hover:text-white transition-colors">
            <i className="fab fa-youtube mr-2"></i> Suscribirse
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
