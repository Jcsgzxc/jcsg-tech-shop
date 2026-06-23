'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface FlyingItemData {
  id: number;
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onDone: (id: number) => void;
}

export function FlyingItem({ id, src, startX, startY, endX, endY, onDone }: FlyingItemData) {
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlying(true));
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  const dx = endX - startX;
  const dy = endY - startY;

  return createPortal(
    <img
      src={src}
      alt=""
      aria-hidden
      onTransitionEnd={() => onDone(id)}
      className="pointer-events-none fixed z-[9999] h-16 w-16 rounded-md object-cover shadow-2xl ring-2 ring-primary/40"
      style={{
        left: startX - 32,
        top: startY - 32,
        transform: flying
          ? `translate(${dx}px, ${dy}px) scale(0.2) rotate(-15deg)`
          : 'translate(0,0) scale(1) rotate(0deg)',
        opacity: flying ? 0.2 : 1,
        transition:
          'transform 700ms cubic-bezier(.5,-0.25,.75,.25), opacity 700ms ease-out',
        willChange: 'transform, opacity',
      }}
    />,
    document.body
  );
}