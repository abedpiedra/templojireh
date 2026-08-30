import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import FacebookFeed from "./FacebookFeed";

const cuentas = [
  {
    red: "Instagram",
    icon: "fab fa-instagram",
    username: "templo_jireh",
    name: "Templo Jireh",
    url: "https://www.instagram.com/templo_jireh/",
    description: "Cuenta oficial: anuncios, actividades y vida de la iglesia.",
  },
  {
    red: "Instagram",
    icon: "fab fa-instagram",
    username: "jovenestj_",
    name: "Jóvenes Templo Jireh",
    url: "https://www.instagram.com/jovenestj_/",
    description: "Ministerio de jóvenes: reuniones de los viernes y encuentros.",
  },
  {
    red: "YouTube",
    icon: "fab fa-youtube",
    username: "TemploJirehTV",
    name: "Templo Jireh TV",
    url: "https://www.youtube.com/@TemploJirehTV",
    description: "Transmisiones en vivo y el archivo completo de predicaciones.",
  },
];

export default function RedesSocialesPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Redes sociales"
        breadcrumb="Redes sociales"
        description="Síguenos para enterarte de todo lo que pasa durante la semana."
      />

      <section className="bg-canvas-sunken py-14 md:py-16">
        <div className="container mx-auto px-4">
          {/* Todas las cuentas juntas y con el mismo peso: la persona
              elige la plataforma donde ya está. */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cuentas.map((cuenta) => (
              <a
                key={cuenta.url}
                href={cuenta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-interactive flex flex-col p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-tint">
                    <i className={`${cuenta.icon} text-xl text-primary`}></i>
                  </div>
                  <div className="min-w-0">
                    <h2 className="type-title-3 text-dark">{cuenta.name}</h2>
                    <p className="type-footnote text-ink-tertiary truncate">
                      @{cuenta.username}
                    </p>
                  </div>
                </div>
                <p className="type-footnote text-ink-secondary mt-4 flex-1">
                  {cuenta.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 type-footnote font-semibold text-primary">
                  Ver en {cuenta.red}
                  <i className="fas fa-arrow-up-right-from-square text-[11px]"></i>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Facebook: encabezado compacto arriba y el muro a lo ancho, para
          que sirva tanto a las fichas propias como al plugin de respaldo. */}
      <section className="py-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint">
                <i className="fab fa-facebook-f text-primary"></i>
              </div>
              <div>
                <h2 className="type-title-2 text-dark">Lo último en Facebook</h2>
                <p className="type-footnote text-ink-tertiary">
                  Fotos de cada actividad y los anuncios de la semana.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/Jirehchurch0498"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <i className="fab fa-facebook-f"></i> Seguir en Facebook
              </a>
              <a
                href="https://wa.me/56957268552?text=Hola%2C%20quiero%20recibir%20los%20anuncios%20de%20Templo%20Jireh."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <i className="fab fa-whatsapp text-[#25D366]"></i> Recibir anuncios
              </a>
            </div>
          </div>

          <FacebookFeed />
        </div>
      </section>

      <Footer />
    </>
  );
}
