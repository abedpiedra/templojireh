"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSheet } from "@/lib/useSheet";
import WhatsAppFab from "@/components/WhatsAppFab";
import BotonTema from "@/components/BotonTema";
import { useProximoServicio } from "@/lib/useProximoServicio";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/en-vivo", label: "Transmisiones", isLive: true },
  { href: "/redes", label: "Redes" },
  { href: "/contacto", label: "Contacto" },
];

const social = [
  { href: "https://www.facebook.com/Jirehchurch0498", icon: "fab fa-facebook-f", label: "Facebook" },
  { href: "https://www.youtube.com/@TemploJirehTV", icon: "fab fa-youtube", label: "YouTube" },
  { href: "https://www.instagram.com/templo_jireh/", icon: "fab fa-instagram", label: "Instagram" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const proximo = useProximoServicio();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  const { mounted, sheetRef, scrimRef, dragHandlers } = useSheet({
    open: isMenuOpen,
    onClose: () => setIsMenuOpen(false),
    from: "top",
  });

  useEffect(() => {
    // El sondeo se cancela al desmontar, para no dejar peticiones sueltas
    // ni actualizar estado de un componente que ya no existe.
    const controlador = new AbortController();

    const checkLiveStatus = async () => {
      try {
        const res = await fetch("/api/youtube/live", {
          signal: controlador.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        setIsLive(Boolean(data.isLive));
      } catch {
        // Saber si hay transmisión es un extra, no una función crítica:
        // si la red falla, el aviso simplemente no aparece. Registrarlo
        // cada minuto solo llenaría la consola de ruido.
        setIsLive(false);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000);
    return () => {
      clearInterval(interval);
      controlador.abort();
    };
  }, []);

  // El borde de scroll aparece solo cuando el contenido pasa bajo el chrome
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar al navegar: la hoja sale por el mismo borde por el que entro
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Cuando hay transmision, es la accion mas valiosa del sitio:
          ocupa una barra propia en lugar de un punto de 8 px */}
      {isLive && (
        <Link
          href="/en-vivo"
          className="pressable block bg-primary text-white animate-rise-in"
        >
          <div className="container mx-auto flex items-center justify-center gap-2.5 px-4 py-2.5 type-footnote font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
            </span>
            Estamos transmitiendo en vivo
            <span className="hidden sm:inline opacity-80">· Entrar ahora</span>
            <i className="fas fa-arrow-right text-[11px]"></i>
          </div>
        </Link>
      )}

      {/* Franja de contacto: informacion de estado, no navegacion */}
      <div className="material-dark vibrant-on-dark py-2 type-caption hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span>
              <i className="fas fa-map-marker-alt text-primary-light mr-2"></i>
              Presidente Alessandri #0498, La Granja
            </span>
            <a href="tel:+56957268552" className="pressable inline-block hover:text-primary-light">
              <i className="fas fa-phone text-primary-light mr-2"></i>
              +56 9 5726 8552
            </a>
            {proximo && (
              <span>
                <i className="fas fa-calendar-day text-primary-light mr-2"></i>
                Próximo: {proximo.nombre} · {proximo.cuando}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {social.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="pressable w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/15"
              >
                <i className={item.icon}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Chrome flotante: el contenido pasa por debajo */}
      <header
        ref={headerRef}
        data-scrolled={scrolled}
        className="material material-edge-bottom scroll-edge sticky top-0 z-50 border-b border-separator"
      >
        <div className="container mx-auto px-4 h-[3.75rem] md:h-[4.5rem] flex justify-between items-center gap-4">
          {/* Logotipo oficial: ya trae el nombre, no se duplica en texto.
              El SVG se sirve tal cual, sin pasar por el optimizador. */}
          <Link
            href="/"
            aria-label="Templo Jireh - Inicio"
            className="pressable tactil flex shrink-0 items-center"
          >
            {/* Dos versiones del mismo logotipo: la de tema claro lleva el
                nombre en grafito y la de tema oscuro en blanco. Se conmutan
                con CSS para que no haya un salto al hidratar. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-templo-jireh-web.svg"
              alt="Templo Jireh"
              width={187}
              height={40}
              className="h-8 w-auto md:h-10 dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-templo-jireh-web-oscuro.svg"
              alt=""
              aria-hidden="true"
              width={187}
              height={40}
              className="hidden h-8 w-auto md:h-10 dark:block"
            />
          </Link>

          {/* Navegacion de escritorio: el indicador activo es una pastilla,
              no un cambio de color suelto. El ultimo elemento no es un
              enlace mas: es la accion que queremos que ocurra. */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`pressable relative flex items-center gap-1.5 rounded-full px-3.5 py-2 type-footnote font-medium ${
                        active
                          ? "bg-primary-tint text-primary"
                          : "text-ink-secondary hover:bg-fill/40 hover:text-ink"
                      }`}
                    >
                      {link.label}
                      {link.isLive && isLive && (
                        <span className="relative flex h-2 w-2" aria-label="En vivo ahora">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
              <li className="ml-1">
                <BotonTema />
              </li>
              <li className="ml-1">
                <Link
                  href="/contacto"
                  className="pressable inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 type-footnote font-semibold text-white shadow-raised hover:bg-primary-dark"
                >
                  Planifica tu visita
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <BotonTema />
            {/* Boton de menu: responde en pointer-down */}
            <button
            type="button"
              className="pressable h-11 w-11 rounded-full flex items-center justify-center text-lg text-ink bg-fill/30"
            aria-expanded={isMenuOpen}
            aria-controls="menu-movil"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            onPointerDown={() => setIsMenuOpen((v) => !v)}
          >
              <i className={`fas ${isMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hoja de navegacion movil: arrastrable, interrumpible,
          entra y sale por el borde superior */}
      {mounted && (
        <div className="md:hidden fixed inset-0 z-40 pointer-events-none">
          <div
            ref={scrimRef}
            className="scrim absolute inset-0 pointer-events-auto"
            style={{ opacity: 0 }}
            onPointerDown={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={sheetRef}
            id="menu-movil"
            className="material-thick absolute left-0 right-0 top-[3.75rem] md:top-[4.5rem] pointer-events-auto rounded-b-sheet shadow-floating pb-3"
            style={{ touchAction: "none" }}
            {...dragHandlers}
          >
            <nav className="px-3 pt-3">
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`pressable flex items-center gap-2 rounded-control px-4 py-3 font-medium ${
                          active ? "bg-primary-tint text-primary" : "vibrant-primary"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                        {link.isLive && isLive && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="px-3 pt-2">
              <Link
                href="/contacto"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary w-full"
              >
                Planifica tu visita
              </Link>
            </div>

            <div className="flex justify-center gap-2 px-4 pt-3 pb-2">
              {social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="pressable w-10 h-10 rounded-full bg-fill/30 flex items-center justify-center vibrant-primary"
                >
                  <i className={item.icon}></i>
                </a>
              ))}
            </div>

            {/* Asa: indica que la hoja se puede agarrar y devolver */}
            <div className="sheet-grabber mt-1" />
          </div>
        </div>
      )}

      <WhatsAppFab />
    </>
  );
}
