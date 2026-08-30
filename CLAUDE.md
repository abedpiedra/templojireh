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
│   ├── users/                # CRUD usuarios del panel
│   ├── youtube/              # Estado en vivo, videos y sincronización
│   └── setup/                # Creación del primer administrador
├── admin/
│   ├── login/                # Login admin
│   └── usuarios/             # Gestión de usuarios
├── nosotros/                 # Página sobre nosotros
├── en-vivo/                  # Transmisiones en vivo y archivo
├── redes/                    # Redes sociales
├── contacto/                 # Página de contacto
└── page.tsx                  # Home
lib/
├── mongodb.ts                # Conexión MongoDB
├── spring.ts                 # Resortes, proyección de momentum, rubber-band
├── useSheet.ts               # Hojas y cajones arrastrables
├── horarios.ts               # Horarios y cálculo de próxima reunión
├── youtube.ts                # Utilidades de enlaces de YouTube
└── models/
    ├── User.ts               # Modelo usuarios
    └── YouTubeVideo.ts       # Modelo videos sincronizados
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

## Integraciones externas

- **YouTube Data API** (`YOUTUBE_API_KEY`): estado en vivo y sincronización de
  videos hacia MongoDB.
- **Facebook Graph API** (`FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN`): publicaciones
  de la página en `/redes`. Es **opcional**: sin las variables, `FacebookFeed`
  cae automáticamente al plugin oficial de Facebook. El token se lee solo en
  `app/api/facebook/posts/route.ts` y nunca llega al navegador.

## Comandos Útiles

```bash
npm run dev      # Desarrollo local (http://localhost:3000)
npm run build    # Build de producción
npm run start    # Iniciar en modo producción
```

## Sistema de Diseño

- Tokens en `tailwind.config.ts`, tomados del manual de marca
  (kit completo en OneDrive: `JIREH ANIVERSARIO/Logos Jireh`, archivo
  `01 Para la web y apps/colores-marca.css`):
  rojo `#D6122F`, rojo llama `#FF4A5F`, vino `#690D24`, grafito `#1C1C22`,
  humo `#F4F4F6`. Tipografía de marca: **Montserrat**
- Recursos de marca servidos desde `public/`: `favicon.ico`, `icono-*.png`,
  `apple-touch-icon-180x180.png`, `android-chrome-*.png`, `maskable-512x512.png`,
  `og-image-1200x630.png`, `site.webmanifest`, `logo-templo-jireh-web.svg`
  (y su versión blanca) e `isotipo-jireh.svg`
- El kit completo (PDF y PNG de imprenta) NO vive en el repositorio: está en
  OneDrive. En `public/` solo se guardan los recursos que el sitio sirve
- Fundamentos en `app/globals.css`: escala tipográfica con tracking por tamaño,
  materiales translúcidos, respuesta al puntero y preferencias del sistema
  (`prefers-reduced-motion`, `-transparency`, `-contrast`)
- Movimiento con resortes interrumpibles (`lib/spring.ts`), nunca duraciones fijas
  para lo que se puede tocar
- Tamaño base de texto: `html { font-size }` en `globals.css` (un solo punto)

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
