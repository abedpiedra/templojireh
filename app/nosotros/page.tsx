import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <PageHeader title="Nosotros" breadcrumb="Nosotros" />

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="section-subtitle">Nuestra Historia</p>
              <h2 className="section-title">Una Iglesia con Propósito</h2>
              <p className="text-gray-600 mb-4">
                Templo Jireh nació con la visión de ser un lugar donde cada
                persona pueda encontrar a Dios y experimentar su amor
                transformador. Desde nuestros inicios, hemos sido una comunidad
                comprometida con la predicación de la Palabra y el servicio a
                nuestra comunidad.
              </p>
              <p className="text-gray-600 mb-4">
                A lo largo de los años, hemos crecido no solo en número, sino
                también en profundidad espiritual. Creemos que cada persona
                tiene un propósito divino y trabajamos para ayudar a cada
                miembro a descubrir y desarrollar sus dones y talentos.
              </p>
              <p className="text-gray-600">
                Bajo el liderazgo del Pastor Luis Luengo, continuamos creciendo
                y alcanzando a más personas con el mensaje de esperanza y
                salvación que solo Cristo puede ofrecer.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800"
                alt="Templo Jireh"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl md:order-1 order-2">
              <Image
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800"
                alt="Comunidad"
                fill
                className="object-cover"
              />
            </div>
            <div className="md:order-2 order-1">
              <p className="section-subtitle">Nuestra Misión</p>
              <h2 className="section-title">Transformando Vidas</h2>
              <p className="text-gray-600 mb-4">
                Nuestra misión es clara: llevar el mensaje de salvación a toda
                persona, discipular a los creyentes y equiparlos para servir.
                Creemos en el poder de la comunidad cristiana para impactar
                positivamente en la sociedad.
              </p>
              <ul className="space-y-3">
                {[
                  "Predicar el Evangelio con fidelidad",
                  "Formar discípulos comprometidos",
                  "Servir a nuestra comunidad",
                  "Fortalecer las familias",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <i className="fas fa-check-circle text-secondary mr-3"></i>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Lo Que Creemos</p>
            <h2 className="section-title">Nuestros Valores</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: "fa-bible",
                title: "Palabra de Dios",
                desc: "La Biblia es nuestra autoridad máxima en fe y conducta.",
              },
              {
                icon: "fa-praying-hands",
                title: "Oración",
                desc: "Buscamos la dirección de Dios en todo lo que hacemos.",
              },
              {
                icon: "fa-heart",
                title: "Amor",
                desc: "El amor de Cristo nos motiva a amar sin condiciones.",
              },
              {
                icon: "fa-hands-helping",
                title: "Servicio",
                desc: "Servimos siguiendo el ejemplo de Jesús.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <i
                  className={`fas ${item.icon} text-4xl text-primary mb-4`}
                ></i>
                <h3 className="text-xl font-semibold text-dark mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Liderazgo</p>
            <h2 className="section-title">Nuestro Equipo</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "Pastor Luis Luengo",
                role: "Pastor Principal",
                img: "/prluis.png",
              },
              {
                name: "Magdalena Medina",
                role: "Pastora",
                img: null,
              },
              {
                name: "Dominique Cisterna",
                role: "Líder de Jóvenes",
                img: "/dominique.png",
              },
              {
                name: "Evelyn Perez",
                role: "Superintendente Escuela Dominical",
                img: null,
              },
            ].map((person, i) => (
              <div key={i} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary">
                  {person.img ? (
                    <Image
                      src={person.img}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <i className="fas fa-user text-6xl text-gray-400"></i>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-dark">
                  {person.name}
                </h3>
                <p className="text-gray-500 text-sm">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-dark to-dark-light text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Quieres Conocernos?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Te invitamos a visitarnos este domingo y ser parte de nuestra
            familia.
          </p>
          <a
            href="/contacto"
            className="inline-block px-8 py-4 bg-white text-dark font-semibold rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Planifica tu Visita
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
