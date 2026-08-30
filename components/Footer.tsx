import Link from "next/link";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/en-vivo", label: "Transmisiones" },
  { href: "/redes", label: "Redes" },
  { href: "/contacto", label: "Contacto" },
];

const social = [
  { href: "https://www.facebook.com/Jirehchurch0498", icon: "fab fa-facebook-f", label: "Facebook" },
  { href: "https://www.youtube.com/@TemploJirehTV", icon: "fab fa-youtube", label: "YouTube" },
  { href: "https://www.instagram.com/templo_jireh/", icon: "fab fa-instagram", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer id="pie-sitio" className="bg-dark text-white pt-12 pb-8 md:pt-16">
      <div className="container mx-auto px-4">
        {/* Cierre con la accion principal: el pie tambien convierte */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6 rounded-card bg-white/5 p-6 md:mb-12 md:p-8">
          <div>
            <p className="type-title-2">Te esperamos este domingo</p>
            <p className="type-footnote text-white/60 mt-1">
              Escuela Dominical 10:00 · Servicio de adoración 11:15
            </p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto sm:flex-wrap">
            <Link
              href="/contacto"
              className="btn-base min-w-0 flex-1 bg-white px-3 text-center text-[0.875rem] text-dark hover:bg-white/90 sm:flex-none sm:px-6 sm:text-base"
            >
              Planifica tu visita
            </Link>
            <a
              href="https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline min-w-0 flex-1 px-3 text-center text-[0.875rem] sm:flex-none sm:px-6 sm:text-base"
            >
              Cómo llegar
            </a>
          </div>
        </div>

        {/* En el teléfono, cinco bloques apilados obligaban a recorrer
            media pantalla de puro pie. Secciones y redes comparten franja;
            horarios y contacto, que llevan líneas largas, van completos. */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:gap-10 lg:grid-cols-5">
          <div className="col-span-2 lg:order-0 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-templo-jireh-web-blanco.svg"
              alt="Templo Jireh"
              width={168}
              height={36}
              className="mb-4 h-9 w-auto"
            />
            <p className="type-footnote text-white/60 max-w-xs">
              Una iglesia comprometida con llevar el mensaje de esperanza y
              salvación a nuestra comunidad. Te esperamos.
            </p>
          </div>

          <nav aria-label="Secciones del sitio" className="col-span-1 lg:order-1">
            <p className="section-subtitle text-primary-light">Secciones</p>
            <ul className="space-y-0.5 -ml-3">
              {enlaces.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="pressable tactil rounded-lg px-3 py-1.5 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-1 lg:order-4">
            <p className="section-subtitle text-primary-light">Síguenos</p>
            <div className="flex flex-wrap gap-2">
              {social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="pressable w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary"
                >
                  <i className={item.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Cada dato de contacto es accionable, no solo texto */}
          <div className="col-span-2 lg:order-2 lg:col-span-1">
            <p className="section-subtitle text-primary-light">Horarios</p>
            <ul className="space-y-1 type-footnote text-white/70">
              <li>Domingo · 10:00 — Escuela Dominical</li>
              <li>Domingo · 11:15 — Servicio de adoración</li>
              <li>Lunes · 20:00 — Dorcas</li>
              <li>Martes y jueves · 20:00 — Adoración</li>
              <li>Viernes · 20:00 — Jóvenes</li>
            </ul>
          </div>

          <div className="col-span-2 lg:order-3 lg:col-span-1">
            <p className="section-subtitle text-primary-light">Contacto</p>
            <ul className="space-y-0.5 -ml-3">
              <li>
                <a
                  href="https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <i className="fas fa-map-marker-alt w-4 shrink-0 text-primary-light"></i>
                  Presidente Alessandri #0498, La Granja
                </a>
              </li>
              <li>
                <a
                  href="tel:+56957268552"
                  className="pressable flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <i className="fas fa-phone w-4 shrink-0 text-primary-light"></i>
                  +56 9 5726 8552
                </a>
              </li>
              <li>
                <a
                  href="mailto:jirehchurch52@gmail.com"
                  className="pressable flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <i className="fas fa-envelope w-4 shrink-0 text-primary-light"></i>
                  jirehchurch52@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center type-caption text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Templo Jireh. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
