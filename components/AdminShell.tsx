'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: 'fas fa-home',
    exact: true,
  },
  {
    href: '/admin/sermones',
    label: 'Sermones',
    icon: 'fas fa-bible',
  },
  {
    href: '/admin/invitacion-jovenes55',
    label: 'Jovenes 55',
    icon: 'fas fa-clipboard-check',
  },
  {
    href: '/admin/usuarios',
    label: 'Usuarios',
    icon: 'fas fa-users',
  },
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

  // Cerrar el menu movil al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra superior (solo movil) */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-16 px-4 bg-dark">
        <h1 className="text-lg font-bold text-white">
          Templo <span className="text-primary">Jireh</span>
        </h1>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          className="p-2 text-white text-2xl"
        >
          <i className="fas fa-bars"></i>
        </button>
      </header>

      {/* Fondo oscuro al abrir el menu en movil */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
        ></div>
      )}

      <aside
        className={`w-64 bg-dark fixed inset-y-0 left-0 h-full overflow-y-auto z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              Templo <span className="text-primary">Jireh</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Panel Admin</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menu"
            className="lg:hidden text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <i className={`${item.icon} w-5`}></i>
                {item.label}
              </Link>
            )
          })}

          <div className="border-t border-white/10 my-4"></div>

          <Link
            href="/invitacion-jovenes55"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <i className="fas fa-external-link-alt w-5"></i>
            Ver Invitacion
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <i className="fas fa-globe w-5"></i>
            Ver Sitio
          </Link>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
            >
              <i className="fas fa-sign-out-alt w-5"></i>
              Salir
            </button>
          ) : null}
        </nav>
      </aside>

      <main className="lg:ml-64 pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-8">
        {children}
      </main>
    </div>
  )
}
