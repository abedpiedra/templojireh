import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProximoServicioChip from "@/components/ProximoServicioChip";
import HomeTransmisiones from "./HomeTransmisiones";

const horarios = [
  { icon: "fa-sun", title: "Escuela Dominical", time: "Domingos · 10:00" },
  {
    icon: "fa-book-bible",
    title: "Servicios de Adoración",
    time: "Martes y jueves · 20:00 — Domingos · 11:15",
  },
  { icon: "fa-praying-hands", title: "Dorcas", time: "Lunes · 20:00" },
  { icon: "fa-users", title: "Jóvenes", time: "Viernes · 20:00" },
];

const areas = [
  {
    icon: "fa-church",
    title: "Escuela Dominical",
    desc: "Un tiempo dedicado a la enseñanza bíblica y la formación espiritual.",
  },
  {
    icon: "fa-users",
    title: "Jóvenes",
    desc: "Un espacio para crecer en fe y construir relaciones significativas.",
  },
  {
    icon: "fa-heart",
    title: "Dorcas",
    desc: "Mujeres que se reúnen para crecer en fe, compartir experiencias y fortalecerse en la Palabra.",
  },
];

// Lo que una persona que nunca ha venido necesita saber antes de decidir.
// Solo datos verificables del sitio: horario, direccion y canal de contacto.
const primeraVisita = [
  {
    icon: "fa-clock",
    title: "¿Cuándo llegar?",
    desc: "El servicio dominical de adoración comienza a las 11:15. Si prefieres partir por la Escuela Dominical, es a las 10:00.",
  },
  {
    icon: "fa-location-dot",
    title: "¿Dónde estamos?",
    desc: "Presidente Alessandri #0498, La Granja, Santiago. Toca la dirección para abrir el mapa.",
    href: "https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja",
    linkLabel: "Cómo llegar",
  },
  {
    icon: "fa-comments",
    title: "¿Tienes una pregunta antes de venir?",
    desc: "Escríbenos por WhatsApp y te respondemos. No necesitas anunciarte para venir: puedes llegar directamente.",
    href: "https://wa.me/56957268552?text=Hola%2C%20quiero%20visitar%20Templo%20Jireh%20y%20tengo%20una%20consulta.",
    linkLabel: "Escribir por WhatsApp",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero: una sola idea, jerarquia por peso y tamano */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-dark">
        <Image
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(16,16,18,0.95) 0%, rgba(16,16,18,0.74) 45%, rgba(123,18,42,0.42) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="max-w-2xl text-white">
            <p className="section-subtitle text-primary-light">
              Iglesia Cristiana Pentecostal de Chile
            </p>
            <h1 className="type-display">
              Bienvenidos a<br />
              <span className="text-primary-light">Templo Jireh</span>
            </h1>
            <p className="type-body-lg mt-5 max-w-lg text-white/75">
              Un lugar donde encontrarás esperanza, fe y una familia que te
              espera con los brazos abiertos.
            </p>

            {/* Responde "cuando puedo ir" sin que la persona tenga que buscar */}
            <div className="mt-6">
              <ProximoServicioChip />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contacto" className="btn-primary">
                Planifica tu visita
              </Link>
              <Link href="/en-vivo" className="btn-outline">
                Ver transmisiones
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Horarios: capa flotante sobre el hero, con desplazamiento
          horizontal con snap en pantallas pequenas */}
      <section className="relative z-20 -mt-14 md:-mt-16">
        <div className="container mx-auto px-4">
          <div className="material-thick rounded-card shadow-floating border border-white/40 overflow-hidden">
            <div className="snap-row no-scrollbar flex overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible">
              {horarios.map((item) => (
                <div
                  key={item.title}
                  className="snap-item min-w-[74%] sm:min-w-[46%] md:min-w-0 px-6 py-7 border-r border-separator last:border-r-0"
                >
                  <i
                    className={`fas ${item.icon} text-primary text-xl mb-3 block`}
                    aria-hidden="true"
                  ></i>
                  <h2 className="type-title-3 vibrant-primary">{item.title}</h2>
                  <p className="type-footnote vibrant-secondary mt-1">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transmisiones: el contenido que se publica cada semana y el que
          hace volver. Va arriba y se reproduce dentro del sitio. */}
      <section id="transmisiones" className="py-20 md:py-24 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-subtitle">Palabra de Dios</p>
              <h2 className="section-title mb-0">Últimas transmisiones</h2>
            </div>
            <Link
              href="/en-vivo"
              className="pressable type-footnote font-semibold text-primary"
            >
              Ver todas <i className="fas fa-arrow-right ml-1 text-[11px]"></i>
            </Link>
          </div>

          <HomeTransmisiones />
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="bg-canvas-sunken py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="relative h-[380px] overflow-hidden rounded-card shadow-floating">
              <Image
                src="/iglesia.png"
                alt="Fachada del Templo Jireh"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="section-subtitle">Sobre nosotros</p>
              <h2 className="section-title">Una iglesia con propósito</h2>
              <p className="type-body text-ink-secondary">
                Templo Jireh es una comunidad de fe comprometida con el
                crecimiento espiritual y el servicio a nuestra comunidad. Bajo
                el liderazgo del Pastor Luis Luengo, trabajamos juntos para
                llevar el mensaje de esperanza y salvación.
              </p>
              <ul className="my-6 space-y-2.5">
                {[
                  "Predicación basada en la Biblia",
                  "Comunidad acogedora",
                  "Ministerios para todas las edades",
                  "Compromiso con la comunidad",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 type-body text-ink-secondary">
                    <i className="fas fa-check-circle text-primary mt-1"></i>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/nosotros" className="btn-primary">
                Conocer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pastor */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="section-subtitle">Nuestro pastor</p>
              <h2 className="section-title">Pastor Luis Luengo</h2>
              <p className="type-body text-ink-secondary">
                Con más de 40 años de ministerio, el Pastor Luis Luengo ha
                dedicado su vida a servir a Dios y a guiar a su congregación en
                el camino de la fe.
              </p>
              <blockquote className="mt-6 rounded-card bg-canvas-sunken p-6">
                <i className="fas fa-quote-left text-primary mb-3 block"></i>
                <p className="type-body-lg text-ink italic">
                  Nuestra misión es ser una iglesia que transforma vidas a
                  través del amor de Cristo.
                </p>
              </blockquote>
            </div>
            <div className="relative h-[440px] overflow-hidden rounded-card shadow-floating">
              <Image
                src="/prluis.png"
                alt="Pastor Luis Luengo"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="bg-canvas-sunken py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-xl">
            <p className="section-subtitle">Lo que hacemos</p>
            <h2 className="section-title">Nuestras áreas</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {areas.map((item) => (
              <article key={item.title} className="card p-7">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint">
                  <i className={`fas ${item.icon} text-xl text-primary`}></i>
                </div>
                <h3 className="type-title-3 text-dark mb-2">{item.title}</h3>
                <p className="type-footnote text-ink-secondary">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Primera visita: quita las dudas que frenan a quien nunca ha venido */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-xl">
            <p className="section-subtitle">¿Es tu primera vez?</p>
            <h2 className="section-title">Lo que necesitas saber</h2>
            <p className="type-body text-ink-secondary">
              No hace falta que avises ni que traigas nada. Ven como estás.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {primeraVisita.map((item) => (
              <article key={item.title} className="card p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint">
                  <i className={`fas ${item.icon} text-primary`}></i>
                </div>
                <h3 className="type-title-3 text-dark mb-2">{item.title}</h3>
                <p className="type-footnote text-ink-secondary">{item.desc}</p>
                {item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable mt-4 inline-flex items-center gap-2 type-footnote font-semibold text-primary"
                  >
                    {item.linkLabel}
                    <i className="fas fa-arrow-right text-[11px]"></i>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Invitacion final */}
      <section className="relative overflow-hidden bg-dark py-20 text-center text-white md:py-24">
        <div className="brand-wash absolute inset-0" aria-hidden="true" />
        <div className="container relative mx-auto px-4">
          <h2 className="type-title-1">Te esperamos este domingo</h2>
          <p className="type-body-lg mx-auto mt-4 max-w-lg text-white/70">
            Escuela Dominical a las 10:00 y servicio de adoración a las 11:15,
            en Presidente Alessandri #0498, La Granja.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contacto"
              className="btn-base bg-white px-8 py-4 text-dark shadow-floating hover:bg-white/90"
            >
              Planifica tu visita
            </Link>
            <a
              href="https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-8 py-4"
            >
              <i className="fas fa-location-dot"></i> Cómo llegar
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
