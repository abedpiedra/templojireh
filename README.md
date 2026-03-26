# Templo Jireh - Sitio Web

Sitio web oficial de Templo Jireh, iglesia cristiana. Desarrollado con Next.js 14.

## Características

- Página principal con información de la iglesia
- Sección de sermones con videos de YouTube
- Calendario de eventos
- Blog con artículos y reflexiones
- Panel de administración protegido
- Diseño responsive

## Tecnologías

- **Next.js 14** - Framework React
- **MongoDB Atlas** - Base de datos
- **NextAuth.js** - Autenticación
- **Tailwind CSS** - Estilos
- **TypeScript** - Tipado estático
- **Vercel** - Hosting

## Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/abedpiedra/templojireh.git
cd templojireh

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Variables de Entorno

Crear archivo `.env.local`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/templojireh
NEXTAUTH_SECRET=tu-secret-aqui
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@templojireh.com
ADMIN_PASSWORD=tu-password-seguro
```

## Panel de Administración

Acceder a `/admin/login` con las credenciales configuradas en las variables de entorno.

Funcionalidades:
- Gestionar sermones
- Gestionar eventos
- Gestionar artículos del blog

## Despliegue en Vercel

1. Importar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno
3. Desplegar

Los cambios en la rama `main` se despliegan automáticamente.

## Estructura del Proyecto

```
├── app/                  # App Router de Next.js
│   ├── api/              # API Routes
│   ├── admin/            # Panel de administración
│   └── [páginas]/        # Páginas públicas
├── components/           # Componentes React
├── lib/                  # Utilidades y modelos
└── public/               # Archivos estáticos
```

## Licencia

Proyecto privado - Templo Jireh
