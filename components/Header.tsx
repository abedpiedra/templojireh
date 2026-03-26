"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/sermones", label: "Sermones" },
    { href: "/eventos", label: "Eventos" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <>
      {/* Header Top */}
      <div className="bg-dark text-white py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span>
              <i className="fas fa-map-marker-alt text-primary mr-2"></i>
              Presidente Alessandri #0498, La Granja
            </span>
            <span>
              <i className="fas fa-phone text-primary mr-2"></i>
              +56 9 5726 8552
            </span>
            <span>
              <i className="fas fa-envelope text-primary mr-2"></i>
              jirehchurch52@gmail.com
            </span>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/Jirehchurch0498"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.youtube.com/@TemploJirehTV"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://www.instagram.com/templo_jireh/"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Header Main */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-dark">
            Templo <span className="text-primary">Jireh</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>

          {/* Navigation */}
          <nav
            className={`${isMenuOpen ? "block" : "hidden"} md:block absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none`}
          >
            <ul className="flex flex-col md:flex-row md:gap-8 p-4 md:p-0">
              {navLinks.map((link) => (
                <li
                  key={link.href}
                  className="border-b md:border-none border-gray-100"
                >
                  <Link
                    href={link.href}
                    className={`block py-3 md:py-0 font-medium transition-colors hover:text-primary ${
                      pathname === link.href ? "text-primary" : "text-dark"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
