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
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Cierre con la accion principal: el pie tambien convierte */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6 rounded-card bg-white/5 p-6 md:p-8">
          <div>
            <p className="type-title-2">Te esperamos este domingo</p>
            <p className="type-footnote text-white/60 mt-1">
              Escuela Dominical 10:00 · Servicio de adoración 11:15
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contacto" className="btn-base bg-white text-dark hover:bg-white/90">
              Planifica tu visita
            </Link>
            <a
              href="https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Cómo llegar
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
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

          <nav aria-label="Secciones del sitio">
            <p className="section-subtitle text-primary-light">Secciones</p>
            <ul className="space-y-0.5 -ml-3">
              {enlaces.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="pressable inline-block rounded-lg px-3 py-1.5 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cada dato de contacto es accionable, no solo texto */}
          <div>
            <p className="section-subtitle text-primary-light">Horarios</p>
            <ul className="space-y-1.5 type-footnote text-white/70">
              <li>Domingo · 10:00 — Escuela Dominical</li>
              <li>Domingo · 11:15 — Servicio de adoración</li>
              <li>Lunes · 20:00 — Dorcas</li>
              <li>Martes y jueves · 20:00 — Adoración</li>
              <li>Viernes · 20:00 — Jóvenes</li>
            </ul>
          </div>

          <div>
            <p className="section-subtitle text-primary-light">Contacto</p>
            <ul className="space-y-0.5 -ml-3">
              <li>
                <a
                  href="https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable flex gap-2.5 rounded-lg px-3 py-1.5 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <i className="fas fa-map-marker-alt text-primary-light mt-0.5"></i>
                  Presidente Alessandri #0498, La Granja
                </a>
              </li>
              <li>
                <a
                  href="tel:+56957268552"
                  className="pressable flex gap-2.5 rounded-lg px-3 py-1.5 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <i className="fas fa-phone text-primary-light mt-0.5"></i>
                  +56 9 5726 8552
                </a>
              </li>
              <li>
                <a
                  href="mailto:jirehchurch52@gmail.com"
                  className="pressable flex gap-2.5 rounded-lg px-3 py-1.5 type-footnote text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <i className="fas fa-envelope text-primary-light mt-0.5"></i>
                  jirehchurch52@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="section-subtitle text-primary-light">Síguenos</p>
            <div className="flex gap-2">
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
