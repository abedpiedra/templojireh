import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* About */}
          <div>
            <h4 className="text-xl font-bold mb-4">Templo Jireh</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Somos una iglesia comprometida con llevar el mensaje de esperanza
              y salvación a toda nuestra comunidad. Únete a nosotros y
              experimenta el amor de Dios.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/sermones"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Sermones
                </Link>
              </li>
              <li>
                <Link
                  href="/eventos"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <i className="fas fa-map-marker-alt text-primary mr-2"></i>{" "}
                Presidente Alessandri #0498, La Granja
              </li>
              <li>
                <i className="fas fa-phone text-primary mr-2"></i> +56 9 5726
                8552
              </li>
              <li>
                <i className="fas fa-envelope text-primary mr-2"></i>{" "}
                jirehchurch52@gmail.com
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xl font-bold mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/Jirehchurch0498"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.youtube.com/@TemploJirehTV"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://www.instagram.com/templo_jireh/"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Templo Jireh. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
