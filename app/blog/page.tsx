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

  return (
    <>
      <Header />
      <PageHeader title="Nuestro Blog" breadcrumb="Blog" />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-2 space-y-8">
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">No hay artículos publicados</p>
                </div>
              ) : (
                posts.map((post: any) => (
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
                ))
              )}
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
