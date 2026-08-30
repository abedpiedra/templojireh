import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce Templo Jireh: nuestra historia, misión, valores y el equipo que lidera esta iglesia cristiana en La Granja, Santiago.",
  alternates: { canonical: "/nosotros" },
  openGraph: {
    title: "Nosotros | Templo Jireh",
    description:
      "Nuestra historia, misión y liderazgo. Una iglesia cristiana en La Granja, Santiago.",
    url: "https://templojireh.cl/nosotros",
  },
};

const valores = [
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
];

const equipo = [
  { name: "Pastor Luis Luengo", role: "Pastor Principal", img: "/prluis.png" },
  { name: "Magdalena Medina", role: "Pastora", img: null },
  { name: "Dominique Cisterna", role: "Líder de Jóvenes", img: "/dominique.png" },
  {
    name: "Evelyn Perez",
    role: "Superintendente Escuela Dominical",
    img: null,
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Nosotros"
        breadcrumb="Nosotros"
        description="Quiénes somos, qué creemos y quién lidera esta comunidad."
      />

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-20 grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="section-subtitle">Nuestra historia</p>
              <h2 className="section-title">Una iglesia con propósito</h2>
              <div className="space-y-4 type-body text-ink-secondary">
                <p>
                  Templo Jireh nació con la visión de ser un lugar donde cada
                  persona pueda encontrar a Dios y experimentar su amor
                  transformador. Desde nuestros inicios hemos sido una comunidad
                  comprometida con la predicación de la Palabra y el servicio a
                  nuestra comunidad.
                </p>
                <p>
                  A lo largo de los años hemos crecido no solo en número, sino
                  también en profundidad espiritual. Creemos que cada persona
                  tiene un propósito divino y trabajamos para que cada miembro
                  descubra y desarrolle sus dones.
                </p>
                <p>
                  Bajo el liderazgo del Pastor Luis Luengo continuamos creciendo
                  y alcanzando a más personas con el mensaje de esperanza y
                  salvación que solo Cristo puede ofrecer.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-card shadow-floating">
              <Image
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800"
                alt="Congregación reunida en el templo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="relative order-2 h-[400px] overflow-hidden rounded-card shadow-floating md:order-1">
              <Image
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800"
                alt="Comunidad de la iglesia"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <p className="section-subtitle">Nuestra misión</p>
              <h2 className="section-title">Transformando vidas</h2>
              <p className="type-body text-ink-secondary">
                Llevar el mensaje de salvación a toda persona, discipular a los
                creyentes y equiparlos para servir. Creemos en el poder de la
                comunidad cristiana para impactar positivamente en la sociedad.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Predicar el Evangelio con fidelidad",
                  "Formar discípulos comprometidos",
                  "Servir a nuestra comunidad",
                  "Fortalecer las familias",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 type-body text-ink-secondary"
                  >
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas-sunken py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-xl">
            <p className="section-subtitle">Lo que creemos</p>
            <h2 className="section-title">Nuestros valores</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {valores.map((item) => (
              <article key={item.title} className="card p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint">
                  <i className={`fas ${item.icon} text-lg text-primary`}></i>
                </div>
                <h3 className="type-title-3 text-dark mb-2">{item.title}</h3>
                <p className="type-footnote text-ink-secondary">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-xl">
            <p className="section-subtitle">Liderazgo</p>
            <h2 className="section-title">Nuestro equipo</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {equipo.map((person) => (
              <div key={person.name} className="text-center">
                <div className="relative mx-auto mb-4 h-44 w-44 overflow-hidden rounded-full bg-canvas-sunken shadow-raised">
                  {person.img ? (
                    <Image
                      src={person.img}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <i className="fas fa-user text-4xl text-ink-quaternary"></i>
                    </div>
                  )}
                </div>
                <h3 className="type-title-3 text-dark">{person.name}</h3>
                <p className="type-footnote text-ink-tertiary mt-0.5">
                  {person.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-dark py-20 text-center text-white md:py-24">
        <div className="brand-wash absolute inset-0" aria-hidden="true" />
        <div className="container relative mx-auto px-4">
          <h2 className="type-title-1">¿Quieres conocernos?</h2>
          <p className="type-body-lg mx-auto mt-4 max-w-lg text-white/70">
            Te invitamos a visitarnos este domingo y ser parte de nuestra
            familia.
          </p>
          <Link
            href="/contacto"
            className="btn-base mt-8 bg-white px-8 py-4 text-dark shadow-floating hover:bg-white/90"
          >
            Planifica tu visita
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
