import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingBubblesProps {
  count?: number;
}

export function FloatingBubbles({ count = 12 }: FloatingBubblesProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    setBubbles(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 95}%`,
        size: Math.floor(Math.random() * 14) + 6,
        duration: Math.random() * 14 + 10,
        delay: Math.random() * 14,
        opacity: Math.random() * 0.35 + 0.15,
      }))
    );
  }, [count]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}
