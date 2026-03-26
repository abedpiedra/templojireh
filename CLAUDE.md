# CLAUDE.md - Guía para Claude Code

## Resumen del Proyecto

Sitio web para **Templo Jireh**, una iglesia cristiana. Construido con Next.js 14, MongoDB y NextAuth.

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Base de datos:** MongoDB Atlas con Mongoose
- **Autenticación:** NextAuth.js (Credentials Provider)
- **Estilos:** Tailwind CSS 3
- **Lenguaje:** TypeScript

## Estructura del Proyecto

```
app/
├── api/
│   ├── auth/[...nextauth]/   # Autenticación NextAuth
│   ├── sermones/             # CRUD sermones
│   ├── eventos/              # CRUD eventos
│   └── blog/                 # CRUD blog posts
├── admin/
│   ├── login/                # Login admin
│   ├── sermones/             # Gestión sermones
│   ├── eventos/              # Gestión eventos
│   └── blog/                 # Gestión blog
├── sermones/                 # Página pública sermones
├── eventos/                  # Página pública eventos
├── blog/                     # Página pública blog
├── nosotros/                 # Página sobre nosotros
├── contacto/                 # Página de contacto
└── page.tsx                  # Home
lib/
├── mongodb.ts                # Conexión MongoDB
└── models/
    ├── Sermon.ts             # Modelo sermones
    ├── Evento.ts             # Modelo eventos
    └── BlogPost.ts           # Modelo blog
components/                   # Componentes reutilizables
```

## Variables de Entorno

```env
MONGODB_URI=              # URI de MongoDB Atlas
NEXTAUTH_SECRET=          # Secret para NextAuth (generar con: openssl rand -base64 32)
NEXTAUTH_URL=             # URL del sitio (en producción: https://tu-dominio.vercel.app)
ADMIN_EMAIL=              # Email del administrador
ADMIN_PASSWORD=           # Contraseña del administrador
```

## Comandos Útiles

```bash
npm run dev      # Desarrollo local (http://localhost:3000)
npm run build    # Build de producción
npm run start    # Iniciar en modo producción
```

## Convenciones de Código

- Usar TypeScript para todos los archivos
- Componentes cliente llevan `'use client'` al inicio
- Páginas con `useSearchParams` deben usar Suspense boundary
- APIs en `app/api/` usan Route Handlers de Next.js

## Despliegue

- **Plataforma:** Vercel
- **Rama de producción:** main
- **Rama de desarrollo:** development
- Los push a main despliegan automáticamente

## Notas Importantes

- La autenticación usa credenciales simples (email/password en env)
- Las imágenes se almacenan como URLs externas
- MongoDB Atlas debe tener Network Access configurado para 0.0.0.0/0
