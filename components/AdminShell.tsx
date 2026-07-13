'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-dark fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">
            Templo <span className="text-primary">Jireh</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Panel Admin</p>
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

      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  )
}
