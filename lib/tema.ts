'use client'

export type Tema = 'claro' | 'oscuro'

export const CLAVE_TEMA = 'tj-tema'

/** Lee la preferencia guardada; si no hay, sigue la del sistema. */
export function temaInicial(): Tema {
  if (typeof window === 'undefined') return 'claro'
  const guardado = window.localStorage.getItem(CLAVE_TEMA)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'oscuro'
    : 'claro'
}

/** Duración del cruce entre temas, en milisegundos. */
export const DURACION_CAMBIO = 700

let temporizador: number | undefined

export function aplicarTema(tema: Tema, conTransicion = true) {
  const raiz = document.documentElement

  // El cruce se activa solo durante el cambio: dejar transiciones globales
  // permanentes haría que cada hover arrastre medio segundo de color.
  if (
    conTransicion &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    raiz.classList.add('tema-en-transicion')
    window.clearTimeout(temporizador)
    temporizador = window.setTimeout(
      () => raiz.classList.remove('tema-en-transicion'),
      DURACION_CAMBIO + 60,
    )
  }

  raiz.classList.toggle('dark', tema === 'oscuro')
  // Que la barra del navegador acompañe al tema de la página
  raiz.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light'
}

/**
 * Guion que corre antes del primer pintado.
 *
 * Sin esto la página aparece clara y salta a oscura al hidratarse: un
 * destello blanco en la cara de quien navega de noche.
 */
export const GUION_SIN_DESTELLO = `(function(){try{
var g=localStorage.getItem('${CLAVE_TEMA}');
var o=g==='oscuro'||(!g&&matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',o);
document.documentElement.style.colorScheme=o?'dark':'light';
}catch(e){}})();`
