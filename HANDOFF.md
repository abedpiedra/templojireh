# Traspaso para continuar el proyecto

Este proyecto ya tiene implementado el sistema de confirmaciones para la
invitacion de Jovenes 55. Si alguien pregunta por un sistema para guardar y
visualizar respuestas del formulario, la base ya esta hecha.

## Sistema de confirmaciones Jovenes 55

Ruta publica:

- `/invitacion-jovenes55`

Que hace:

- Muestra la invitacion digital.
- Permite confirmar si una iglesia asistira o no.
- Pide nombre de iglesia y cantidad estimada de jovenes.
- Envia los datos a MongoDB usando la API interna.

API:

- `POST /api/invitacion-jovenes55/confirmaciones`
  - Publica.
  - Guarda una confirmacion nueva.

- `GET /api/invitacion-jovenes55/confirmaciones`
  - Protegida con sesion admin.
  - Devuelve confirmaciones y estadisticas.

Modelo MongoDB:

- `lib/models/YouthInvitationConfirmation.ts`
- Coleccion: `invitacion_jovenes55_confirmaciones`

Campos guardados:

- `churchName`
- `willAttend`
- `estimatedYouth`
- `ipAddress`
- `userAgent`
- `createdAt`
- `updatedAt`

## Panel admin

Ruta:

- `/admin/invitacion-jovenes55`

Que permite ver:

- Total de respuestas.
- Iglesias que asisten.
- Iglesias que no asisten.
- Total estimado de jovenes.
- Tabla de confirmaciones.
- Busqueda por iglesia.
- Filtro por asistencia.
- Exportacion CSV.

La barra lateral admin es global y esta en:

- `components/AdminShell.tsx`

El layout admin la usa desde:

- `app/admin/layout.tsx`

Por eso no hay que volver a copiar la barra lateral dentro de cada pagina admin.
Si se agrega otra seccion admin, agregarla en `components/AdminShell.tsx`.

## Variables necesarias

El sistema depende de MongoDB y NextAuth. Revisar `.env.local` localmente o las
variables del hosting:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

Para enviar emails o usar YouTube, tambien existen:

```env
RESEND_API_KEY=
YOUTUBE_API_KEY=
```

## Como probar localmente

Instalar dependencias si hace falta:

```bash
npm install
```

Correr desarrollo:

```bash
npm.cmd run dev -- -p 3000
```

Validar tipos:

```bash
npx.cmd tsc --noEmit
```

Validar build:

```bash
npm.cmd run build
```

## Flujo recomendado para continuar

1. Trabajar en `development`.
2. Confirmar que `MONGODB_URI` real esta configurado.
3. Probar formulario publico en `/invitacion-jovenes55`.
4. Entrar al admin en `/admin/login`.
5. Revisar respuestas en `/admin/invitacion-jovenes55`.
6. Hacer commit y push a `development`.
7. Abrir PR de `development` hacia `main`.

## Archivos principales

- `app/invitacion-jovenes55/InvitationJovenes55Client.tsx`
- `app/api/invitacion-jovenes55/confirmaciones/route.ts`
- `app/admin/invitacion-jovenes55/page.tsx`
- `components/AdminShell.tsx`
- `lib/models/YouthInvitationConfirmation.ts`
