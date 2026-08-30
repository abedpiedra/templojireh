'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Spring, VelocityTracker, project, rubberband } from './spring';

type Edge = 'top' | 'bottom' | 'left' | 'right';

interface UseSheetOptions {
  open: boolean;
  onClose: () => void;
  /** Borde desde el que entra la hoja. Sale por el mismo borde: camino simetrico. */
  from?: Edge;
  /** Fraccion del recorrido a partir de la cual se confirma el cierre. */
  dismissThreshold?: number;
}

/**
 * Hoja / cajon agarrable en cualquier instante.
 *
 * - Seguimiento 1:1 con el dedo, respetando el punto donde se agarro.
 * - Resistencia elastica al arrastrar en la direccion contraria.
 * - Al soltar, se proyecta el momentum para decidir si cierra o vuelve,
 *   y se traspasa la velocidad al resorte para que no haya costura.
 * - Se puede volver a agarrar mientras se anima; el resorte reanuda
 *   desde el valor presentado, no desde el objetivo logico.
 */
export function useSheet({
  open,
  onClose,
  from = 'top',
  dismissThreshold = 0.35,
}: UseSheetOptions) {
  const [mounted, setMounted] = useState(open);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const springRef = useRef<Spring | null>(null);
  const sizeRef = useRef(0);
  const draggingRef = useRef(false);
  const grabOffsetRef = useRef(0);
  const tracker = useRef(new VelocityTracker()).current;

  const axis = from === 'top' || from === 'bottom' ? 'y' : 'x';
  // Signo del recorrido de salida: hacia donde se va la hoja al cerrarse
  const sign = from === 'top' || from === 'left' ? -1 : 1;

  const measure = useCallback(() => {
    const el = sheetRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return axis === 'y' ? rect.height : rect.width;
  }, [axis]);

  const paint = useCallback(
    (offset: number) => {
      const el = sheetRef.current;
      if (!el) return;
      el.style.transform =
        axis === 'y' ? `translate3d(0, ${offset}px, 0)` : `translate3d(${offset}px, 0, 0)`;
      const size = sizeRef.current || 1;
      const progress = 1 - Math.min(Math.abs(offset) / size, 1);
      if (scrimRef.current) {
        scrimRef.current.style.opacity = String(progress);
      }
    },
    [axis],
  );

  // Montaje / desmontaje: entra y sale por el mismo camino
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const size = measure();
    sizeRef.current = size;
    const closedOffset = size * sign;

    if (!springRef.current) {
      springRef.current = new Spring(closedOffset, (v) => paint(v), {
        damping: 0.85,
        response: 0.35,
      });
      paint(closedOffset);
    }

    const spring = springRef.current;
    if (open) {
      spring.to(0, { damping: 0.85, response: 0.35 });
    } else {
      spring.to(closedOffset, {
        damping: 1,
        response: 0.3,
        onRest: () => setMounted(false),
      });
    }

    return () => {
      if (!open) return;
      spring.stop();
    };
  }, [open, mounted, measure, paint, sign]);

  useEffect(() => {
    return () => {
      springRef.current?.stop();
      springRef.current = null;
    };
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      const el = sheetRef.current;
      const spring = springRef.current;
      if (!el || !spring) return;

      // Interrumpir: se toma el valor presentado en pantalla, no el objetivo
      spring.stop();
      draggingRef.current = true;
      el.setPointerCapture(event.pointerId);

      const point = axis === 'y' ? event.clientY : event.clientX;
      grabOffsetRef.current = point - spring.getValue();
      tracker.reset(point);
    },
    [axis, tracker],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const spring = springRef.current;
      if (!spring) return;

      const point = axis === 'y' ? event.clientY : event.clientX;
      tracker.add(point);

      let offset = point - grabOffsetRef.current;
      // Mas alla de la posicion abierta se resiste, no se bloquea
      if (sign < 0 ? offset > 0 : offset < 0) {
        offset = rubberband(offset, sizeRef.current || 1);
      }
      spring.setValue(offset);
    },
    [axis, sign, tracker],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      const el = sheetRef.current;
      const spring = springRef.current;
      if (!el || !spring) return;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }

      const velocity = tracker.get();
      const size = sizeRef.current || 1;
      const current = spring.getValue();
      // Se anima hacia donde va el gesto, no hacia donde se solto
      const projected = current + project(velocity);
      const shouldClose = Math.abs(projected) > size * dismissThreshold;

      if (shouldClose && Math.sign(projected || sign) === sign) {
        // El traspaso de velocidad elimina la costura entre gesto y animacion
        spring.to(size * sign, {
          damping: 0.9,
          response: 0.3,
          velocity,
          onRest: () => setMounted(false),
        });
        onClose();
      } else {
        spring.to(0, { damping: 0.8, response: 0.35, velocity });
      }
    },
    [dismissThreshold, onClose, sign, tracker],
  );

  return {
    mounted,
    sheetRef,
    scrimRef,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
