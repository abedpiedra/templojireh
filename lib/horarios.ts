/**
 * Horarios de la congregacion, en un solo lugar.
 *
 * El dato mas buscado en el sitio de una iglesia es "cuando y donde".
 * Tenerlo centralizado permite mostrarlo en el hero, en el pie y en la
 * pagina de transmisiones sin que se desincronice.
 */

export interface Horario {
  /** 0 = domingo … 6 = sabado */
  dia: number
  hora: number
  minuto: number
  nombre: string
  icon: string
}

export const HORARIOS: Horario[] = [
  { dia: 0, hora: 10, minuto: 0, nombre: 'Escuela Dominical', icon: 'fa-sun' },
  { dia: 0, hora: 11, minuto: 15, nombre: 'Servicio de Adoración', icon: 'fa-book-bible' },
  { dia: 1, hora: 20, minuto: 0, nombre: 'Dorcas', icon: 'fa-praying-hands' },
  { dia: 2, hora: 20, minuto: 0, nombre: 'Servicio de Adoración', icon: 'fa-book-bible' },
  { dia: 4, hora: 20, minuto: 0, nombre: 'Servicio de Adoración', icon: 'fa-book-bible' },
  { dia: 5, hora: 20, minuto: 0, nombre: 'Jóvenes', icon: 'fa-users' },
]

const DIAS = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
]

/**
 * Proxima reunion a partir de un instante dado.
 * Se calcula en el navegador para usar la hora local de quien visita.
 */
export function proximoServicio(desde: Date = new Date()) {
  let mejor: { horario: Horario; fecha: Date } | null = null

  for (const horario of HORARIOS) {
    const fecha = new Date(desde)
    const diff = (horario.dia - desde.getDay() + 7) % 7
    fecha.setDate(desde.getDate() + diff)
    fecha.setHours(horario.hora, horario.minuto, 0, 0)

    // Si hoy ya paso la hora, se corre a la semana siguiente
    if (fecha.getTime() <= desde.getTime()) {
      fecha.setDate(fecha.getDate() + 7)
    }

    if (!mejor || fecha.getTime() < mejor.fecha.getTime()) {
      mejor = { horario, fecha }
    }
  }

  return mejor
}

export function etiquetaProximoServicio(desde: Date = new Date()) {
  const proximo = proximoServicio(desde)
  if (!proximo) return null

  const { horario, fecha } = proximo
  const hoy = new Date(desde)
  hoy.setHours(0, 0, 0, 0)
  const dia = new Date(fecha)
  dia.setHours(0, 0, 0, 0)
  const dias = Math.round((dia.getTime() - hoy.getTime()) / 86400000)

  const cuando =
    dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : DIAS[fecha.getDay()]
  const hora = `${String(fecha.getHours()).padStart(2, '0')}:${String(
    fecha.getMinutes(),
  ).padStart(2, '0')}`

  return {
    nombre: horario.nombre,
    icon: horario.icon,
    // "Hoy · 20:00" / "domingo · 11:15"
    cuando: `${cuando} · ${hora}`,
  }
}
