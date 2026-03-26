import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SermonCard from "@/components/SermonCard";
import connectDB from "@/lib/mongodb";
import Sermon from "@/lib/models/Sermon";

export const dynamic = "force-dynamic";

async function getSermones() {
  try {
    await connectDB();
    const sermones = await Sermon.find({}).sort({ fecha: -1 }).lean();
    return JSON.parse(JSON.stringify(sermones));
  } catch (error) {
    return [];
  }
}

export default async function SermonesPage() {
  const sermones = await getSermones();

  return (
    <>
      <Header />
      <PageHeader title="Sermones" breadcrumb="Sermones" />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["Todos", "Fe", "Familia", "Oración", "Adoración"].map((cat) => (
              <button
                key={cat}
                className="px-5 py-2 bg-white rounded-full text-sm text-gray-600 shadow hover:bg-primary hover:text-white transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sermons List */}
          {sermones.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-bible text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">
                No hay sermones disponibles
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {sermones.map((sermon: any) => (
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
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-dark to-dark-light text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Te Perdiste un Servicio?</h2>
          <p className="text-gray-300 mb-6">
            Suscríbete a nuestro canal de YouTube para no perderte ningún
            sermón.
          </p>
          <a
            href="https://www.youtube.com/@TemploJirehTV/featured"
            target="_blank"
            className="inline-block px-8 py-4 bg-white text-dark font-semibold rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            <i className="fab fa-youtube mr-2"></i> Suscribirse
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
