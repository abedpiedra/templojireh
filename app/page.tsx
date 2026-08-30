import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProximoServicioChip from "@/components/ProximoServicioChip";
import SeccionEncabezado from "@/components/SeccionEncabezado";
import TarjetaIcono from "@/components/TarjetaIcono";
import BandaCta from "@/components/BandaCta";
import HorariosCarrusel from "@/components/HorariosCarrusel";
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
      <section className="relative flex min-h-[72vh] md:min-h-[78vh] items-center overflow-hidden bg-dark">
        <Image
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920"
          alt=""
          fill
          priority
          // Ocupa todo el ancho en cualquier pantalla
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(28,28,34,0.95) 0%, rgba(28,28,34,0.74) 45%, rgba(105,13,36,0.48) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
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

            {/* Los dos en una linea y del mismo ancho: en movil el texto y
                el relleno se ajustan para que quepan sin partirse */}
            <div className="mt-7 flex gap-3">
              {/* min-w-0 permite que el boton se encoja por debajo del ancho
                  de su texto: sin eso, en pantallas de 320 px el segundo
                  quedaba cortado por el recorte del hero */}
              <Link
                href="/contacto"
                className="btn-primary min-w-0 flex-1 px-3 text-center text-[0.875rem] sm:flex-none sm:px-6 sm:text-base"
              >
                Planifica tu visita
              </Link>
              <Link
                href="/en-vivo"
                className="btn-outline min-w-0 flex-1 px-3 text-center text-[0.875rem] sm:flex-none sm:px-6 sm:text-base"
              >
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
          <HorariosCarrusel horarios={horarios} />
        </div>
      </section>

      {/* Transmisiones: el contenido que se publica cada semana y el que
          hace volver. Va arriba y se reproduce dentro del sitio. */}
      <section id="transmisiones" className="seccion scroll-mt-24">
        <div className="container mx-auto px-4">
          <SeccionEncabezado
            etiqueta="Palabra de Dios"
            titulo="Últimas transmisiones"
            accion={
              <Link
                href="/en-vivo"
                className="pressable tactil type-footnote font-semibold text-primary"
              >
                Ver todas <i className="fas fa-arrow-right ml-1 text-[11px]"></i>
              </Link>
            }
          />

          <HomeTransmisiones />
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="bg-canvas-sunken seccion">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="relative h-[380px] overflow-hidden rounded-card shadow-floating">
              <Image
                src="/iglesia.png"
                alt="Fachada del Templo Jireh"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
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
      <section className="seccion">
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
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="bg-canvas-sunken seccion">
        <div className="container mx-auto px-4">
          <SeccionEncabezado etiqueta="Lo que hacemos" titulo="Nuestras áreas" />
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {areas.map((item) => (
              <TarjetaIcono
                key={item.title}
                icono={item.icon}
                titulo={item.title}
                texto={item.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Primera visita: quita las dudas que frenan a quien nunca ha venido */}
      <section className="seccion">
        <div className="container mx-auto px-4">
          <SeccionEncabezado
            etiqueta="¿Es tu primera vez?"
            titulo="Lo que necesitas saber"
            descripcion="No hace falta que avises ni que traigas nada. Ven como estás."
          />
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {primeraVisita.map((item) => (
              <TarjetaIcono
                key={item.title}
                icono={item.icon}
                titulo={item.title}
                texto={item.desc}
              >
                {item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable tactil mt-2 gap-2 type-footnote font-semibold text-primary"
                  >
                    {item.linkLabel}
                    <i className="fas fa-arrow-right text-[11px]"></i>
                  </a>
                )}
              </TarjetaIcono>
            ))}
          </div>
        </div>
      </section>

      <BandaCta
        titulo="Te esperamos este domingo"
        texto="Escuela Dominical a las 10:00 y servicio de adoración a las 11:15, en Presidente Alessandri #0498, La Granja."
      >
        <Link
          href="/contacto"
          className="btn-base w-full bg-white px-8 py-4 text-dark shadow-floating hover:bg-white/90 sm:w-auto"
        >
          Planifica tu visita
        </Link>
        <a
          href="https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline w-full px-8 py-4 sm:w-auto"
        >
          <i className="fas fa-location-dot"></i> Cómo llegar
        </a>
      </BandaCta>

      <Footer />
    </>
  );
}
