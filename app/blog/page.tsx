import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import BlogCard from '@/components/BlogCard'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'

async function getPosts() {
  try {
    await connectDB()
    const posts = await BlogPost.find({ publicado: true }).sort({ fecha: -1 }).lean()
    return JSON.parse(JSON.stringify(posts))
  } catch (error) {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  // Datos de ejemplo si no hay posts en la BD
  const postsDefault = [
    { _id: '1', titulo: 'La Fe que Mueve Montañas', slug: 'la-fe-que-mueve-montanas', fecha: '2024-03-25', categoria: 'Reflexiones', autor: 'Pastor Luis Luengo', excerpt: 'Descubre cómo la fe genuina puede transformar las circunstancias más difíciles de tu vida.', imagen: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800' },
    { _id: '2', titulo: 'El Poder de la Oración', slug: 'el-poder-de-la-oracion', fecha: '2024-03-20', categoria: 'Enseñanzas', autor: 'Pastor Luis Luengo', excerpt: 'La oración es nuestra conexión directa con el Padre celestial.', imagen: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800' },
    { _id: '3', titulo: 'Fortaleciendo los Lazos Familiares', slug: 'fortaleciendo-lazos-familiares', fecha: '2024-03-15', categoria: 'Familia', autor: 'Pastor Luis Luengo', excerpt: 'La familia es el núcleo de nuestra sociedad y la base de nuestra fe.', imagen: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800' },
  ]

  const postsToShow = posts.length > 0 ? posts : postsDefault

  return (
    <>
      <Header />
      <PageHeader title="Nuestro Blog" breadcrumb="Blog" />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-2 space-y-8">
              {postsToShow.map((post: any) => (
                <BlogCard
                  key={post._id}
                  titulo={post.titulo}
                  slug={post.slug}
                  fecha={post.fecha}
                  categoria={post.categoria}
                  autor={post.autor}
                  excerpt={post.excerpt}
                  imagen={post.imagen}
                />
              ))}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Pastor Widget */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-dark mb-4 pb-3 border-b-2 border-primary">Nuestro Pastor</h3>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
                  alt="Pastor Luis Luengo"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
                />
                <h4 className="font-semibold text-dark">Pastor Luis Luengo</h4>
                <p className="text-gray-500 text-sm">Pastor Principal</p>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-dark mb-4 pb-3 border-b-2 border-primary">Categorías</h3>
                <ul className="space-y-3">
                  {['Reflexiones', 'Enseñanzas', 'Familia', 'Juventud', 'Testimonios'].map((cat) => (
                    <li key={cat} className="flex justify-between text-gray-600 hover:text-primary transition-colors cursor-pointer">
                      <span>{cat}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{Math.floor(Math.random() * 20) + 1}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ministerios */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-dark mb-4 pb-3 border-b-2 border-primary">Ministerios</h3>
                <ul className="space-y-3">
                  {[
                    { icon: 'fa-heart', name: 'Dorcas' },
                    { icon: 'fa-child', name: 'Iglesia de Niños' },
                    { icon: 'fa-users', name: 'Jóvenes' },
                    { icon: 'fa-hands-helping', name: 'Voluntarios' },
                    { icon: 'fa-music', name: 'Adoración' },
                  ].map((item) => (
                    <li key={item.name} className="flex items-center text-gray-600 hover:text-primary transition-colors cursor-pointer">
                      <i className={`fas ${item.icon} text-primary w-6`}></i>
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Widget */}
              <div className="bg-gradient-to-br from-dark to-dark-light rounded-xl shadow-lg p-6 text-center text-white">
                <h3 className="text-lg font-semibold mb-4">Únete a Nosotros</h3>
                <p className="text-gray-300 text-sm mb-4">Sé parte de nuestra familia en Templo Jireh.</p>
                <a href="/contacto" className="inline-block px-6 py-2 bg-primary rounded font-medium hover:bg-primary-dark transition-colors">
                  Sé Parte
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
