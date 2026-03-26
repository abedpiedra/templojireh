# Guía de Configuración - Templo Jireh

## Requisitos Previos

- Node.js 18 o superior
- Cuenta en MongoDB Atlas (gratis)
- Cuenta en Vercel (gratis)
- Cuenta en GitHub

## 1. Configurar MongoDB Atlas

### Crear cuenta y cluster

1. Ir a [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crear cuenta gratuita
3. Crear un nuevo cluster (seleccionar **M0 Free**)
4. Esperar a que se cree (2-3 minutos)

### Configurar acceso

1. **Database Access** → Add New Database User
   - Username: `tu_usuario`
   - Password: `tu_password_segura`
   - Role: Read and write to any database

2. **Network Access** → Add IP Address
   - Seleccionar "Allow Access from Anywhere" (0.0.0.0/0)
   - Esto permite conexiones desde Vercel

### Obtener URI de conexión

1. En tu cluster, clic en **Connect**
2. Seleccionar **Drivers**
3. Copiar la URI:
   ```
   mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
4. Agregar nombre de base de datos:
   ```
   mongodb+srv://usuario:password@cluster.mongodb.net/templojireh?retryWrites=true&w=majority
   ```

## 2. Configuración Local

### Clonar e instalar

```bash
git clone https://github.com/abedpiedra/templojireh.git
cd templojireh
npm install
```

### Variables de entorno

Crear archivo `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/templojireh?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=genera-un-secret-seguro
NEXTAUTH_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@templojireh.com
ADMIN_PASSWORD=tu-password-seguro
```

### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Iniciar desarrollo

```bash
npm run dev
```

Abrir http://localhost:3000

## 3. Despliegue en Vercel

### Conectar repositorio

1. Ir a [vercel.com](https://vercel.com)
2. Iniciar sesión con GitHub
3. **Add New** → **Project**
4. Importar repositorio `templojireh`

### Variables de entorno en Vercel

En **Settings** → **Environment Variables**, agregar:

| Variable | Valor |
|----------|-------|
| `MONGODB_URI` | Tu URI de MongoDB Atlas |
| `NEXTAUTH_SECRET` | El secret generado |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` |
| `ADMIN_EMAIL` | Email del admin |
| `ADMIN_PASSWORD` | Password del admin |

### Desplegar

Clic en **Deploy**. Vercel construirá y desplegará automáticamente.

## 4. Uso del Panel Admin

1. Ir a `https://tu-sitio.vercel.app/admin/login`
2. Ingresar con email y password configurados
3. Gestionar contenido:
   - **Sermones:** Agregar videos de YouTube
   - **Eventos:** Programar eventos de la iglesia
   - **Blog:** Publicar artículos y reflexiones

## 5. Actualizar el Sitio

### Flujo de trabajo

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Vercel detectará el push y desplegará automáticamente.

### Usar rama de desarrollo

```bash
# Cambiar a development
git checkout development

# Hacer cambios...
git add .
git commit -m "Prueba de cambio"
git push origin development

# Vercel crea preview URL para probar

# Cuando esté listo, merge a main
git checkout main
git merge development
git push origin main
```

## Solución de Problemas

### Error "Server error" en login

- Verificar que `NEXTAUTH_URL` esté configurado en Vercel
- Debe ser la URL exacta de tu sitio en Vercel

### Error de conexión a MongoDB

- Verificar que la IP 0.0.0.0/0 esté en Network Access
- Verificar usuario y contraseña en la URI

### Build falla en Vercel

- Verificar que el build funcione localmente: `npm run build`
- Revisar logs en Vercel para ver el error específico

## Contacto

Para soporte técnico, contactar al desarrollador.
