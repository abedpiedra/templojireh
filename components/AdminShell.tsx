'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSheet } from '@/lib/useSheet'
import BotonTema from '@/components/BotonTema'

const navItems = [
  { href: '/admin', label: 'Panel', icon: 'fas fa-gauge', exact: true },
  { href: '/admin/usuarios', label: 'Usuarios', icon: 'fas fa-users' },
]

const salidas = [
  { href: '/', label: 'Ver sitio', icon: 'fas fa-globe' },
]

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href)
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  // El cajon entra y sale por el borde izquierdo, y se puede arrastrar
  const { mounted, sheetRef, scrimRef, dragHandlers } = useSheet({
    open: menuOpen,
    onClose: () => setMenuOpen(false),
    from: 'left',
  })

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navegacion = (
    <nav className="space-y-1 p-3">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`pressable flex items-center gap-3 rounded-control px-4 py-3 type-footnote font-medium ${
              active
                ? 'bg-primary text-white shadow-raised'
                : 'text-white/65 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className={`${item.icon} w-5 text-center`}></i>
            {item.label}
          </Link>
        )
      })}

      <div className="my-3 border-t border-white/10"></div>

      {salidas.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="pressable flex items-center gap-3 rounded-control px-4 py-3 type-footnote text-white/65 hover:bg-white/10 hover:text-white"
        >
          <i className={`${item.icon} w-5 text-center`}></i>
          {item.label}
        </Link>
      ))}

      <div className="hidden px-4 py-2 lg:block">
        <BotonTema claro />
      </div>

      {session && (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="pressable flex w-full items-center gap-3 rounded-control px-4 py-3 type-footnote text-white/65 hover:bg-white/10 hover:text-white"
        >
          <i className="fas fa-arrow-right-from-bracket w-5 text-center"></i>
          Salir
        </button>
      )}
    </nav>
  )

  const encabezado = (
    <div className="border-b border-white/10 p-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-templo-jireh-web-blanco.svg"
        alt="Templo Jireh"
        width={150}
        height={32}
        className="h-8 w-auto"
      />
      <p className="type-caption text-white/45 mt-2">Panel de administración</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas-sunken">
      {/* Barra superior movil: capa translucida, el contenido pasa debajo */}
      <header className="material-dark fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/isotipo-jireh-blanco.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-auto"
          />
          <span className="type-title-3 vibrant-on-dark">Panel</span>
        </div>
        <div className="flex items-center gap-1">
        <BotonTema claro />
        <button
          type="button"
          onPointerDown={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          className="pressable flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <i className="fas fa-bars"></i>
        </button>
        </div>
      </header>

      {/* Cajon movil */}
      {mounted && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            ref={scrimRef}
            className="scrim absolute inset-0"
            style={{ opacity: 0 }}
            onPointerDown={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            ref={sheetRef}
            className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-dark shadow-sheet"
            style={{ touchAction: 'pan-y' }}
            {...dragHandlers}
          >
            {encabezado}
            {navegacion}
          </aside>
        </div>
      )}

      {/* Barra lateral fija en escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto bg-dark lg:block">
        {encabezado}
        {navegacion}
      </aside>

      <main className="px-4 pb-10 pt-20 sm:px-6 lg:ml-64 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
