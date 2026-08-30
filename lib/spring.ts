/**
 * Fisica de interfaz: resortes interrumpibles, proyeccion de momentum
 * y resistencia elastica en los limites.
 *
 * Se parametriza como en las APIs de Apple (damping + response) en lugar de
 * masa/rigidez/amortiguacion:
 *   - damping  1.0 = criticamente amortiguado (sin rebote). < 1.0 = rebota.
 *   - response      = segundos aproximados hasta alcanzar el objetivo.
 *
 * No hay duracion fija: el reposo emerge de los parametros, por eso el
 * movimiento puede reinterrumpirse en cualquier frame sin saltos.
 */

export interface SpringOptions {
  /** Razon de amortiguacion. 1 = sin overshoot (por defecto). ~0.8 = rebote leve. */
  damping?: number;
  /** Rapidez con que se alcanza el objetivo, en segundos. */
  response?: number;
  /** Velocidad inicial en px/s (traspaso desde el gesto). */
  velocity?: number;
}

const RAD = Math.PI * 2;
/** Paso fijo de integracion: estable aunque el frame se retrase. */
const STEP = 1 / 240;

export class Spring {
  private value: number;
  private target: number;
  private velocity: number;
  private damping: number;
  private response: number;
  private raf: number | null = null;
  private lastTime = 0;
  private accumulator = 0;
  private onUpdate: (value: number, velocity: number) => void;
  private onRest?: () => void;

  constructor(
    initialValue: number,
    onUpdate: (value: number, velocity: number) => void,
    options: SpringOptions = {},
  ) {
    this.value = initialValue;
    this.target = initialValue;
    this.velocity = options.velocity ?? 0;
    this.damping = options.damping ?? 1;
    this.response = options.response ?? 0.4;
    this.onUpdate = onUpdate;
  }

  getValue() {
    return this.value;
  }

  getVelocity() {
    return this.velocity;
  }

  /** Fija el valor sin animar (por ejemplo, durante el arrastre 1:1). */
  setValue(value: number, velocity = 0) {
    this.stop();
    this.value = value;
    this.velocity = velocity;
    this.onUpdate(this.value, this.velocity);
  }

  /**
   * Redirige el resorte a un nuevo objetivo. Arranca desde el valor
   * presentado en pantalla y conserva la velocidad actual, de modo que
   * invertir a mitad de camino no produce un muro.
   */
  to(target: number, options: SpringOptions & { onRest?: () => void } = {}) {
    this.target = target;
    if (options.damping !== undefined) this.damping = options.damping;
    if (options.response !== undefined) this.response = options.response;
    // La velocidad se hereda salvo que el gesto entregue una explicita
    if (options.velocity !== undefined) this.velocity = options.velocity;
    this.onRest = options.onRest;

    if (prefersReducedMotion()) {
      // Equivalente no vestibular: sin recorrido elastico
      this.value = target;
      this.velocity = 0;
      this.onUpdate(this.value, this.velocity);
      this.onRest?.();
      return;
    }

    if (this.raf === null) {
      this.lastTime = performance.now();
      this.accumulator = 0;
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  stop() {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  private tick = (now: number) => {
    // requestAnimationFrame es el reloj sincronizado con la pantalla
    const frame = Math.min((now - this.lastTime) / 1000, 0.064);
    this.lastTime = now;
    this.accumulator += frame;

    const omega = RAD / this.response;
    const zeta = this.damping;

    while (this.accumulator >= STEP) {
      const displacement = this.value - this.target;
      const acceleration =
        -omega * omega * displacement - 2 * zeta * omega * this.velocity;
      this.velocity += acceleration * STEP;
      this.value += this.velocity * STEP;
      this.accumulator -= STEP;
    }

    const atRest =
      Math.abs(this.value - this.target) < 0.1 && Math.abs(this.velocity) < 0.5;

    if (atRest) {
      this.value = this.target;
      this.velocity = 0;
      this.raf = null;
      this.onUpdate(this.value, this.velocity);
      this.onRest?.();
      return;
    }

    this.onUpdate(this.value, this.velocity);
    this.raf = requestAnimationFrame(this.tick);
  };
}

/**
 * Proyecta donde terminaria el movimiento con la velocidad de suelta.
 * Es la forma de decaimiento exponencial que usa iOS, no v^2/(2a).
 */
export function project(initialVelocity: number, decelerationRate = 0.998) {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Resistencia progresiva mas alla de un limite: cuanto mas lejos se
 * arrastra, menos sigue el elemento. Nunca un tope duro.
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  if (dimension === 0) return 0;
  return (
    (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
  );
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Historial corto de posiciones para calcular velocidad al soltar. */
export class VelocityTracker {
  private samples: { value: number; time: number }[] = [];

  reset(value: number) {
    this.samples = [{ value, time: performance.now() }];
  }

  add(value: number) {
    const now = performance.now();
    this.samples.push({ value, time: now });
    // Solo interesan los ultimos ~100ms
    while (this.samples.length > 2 && now - this.samples[0].time > 100) {
      this.samples.shift();
    }
  }

  /** px/s a partir de las ultimas muestras. */
  get(): number {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.time - first.time) / 1000;
    if (dt <= 0) return 0;
    return (last.value - first.value) / dt;
  }
}
