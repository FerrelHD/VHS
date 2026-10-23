import { RefObject, useEffect, useRef } from "react";

export const useMousePositionRef = (
  containerRef?: RefObject<HTMLElement | SVGElement | null>
) => {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const relativeX = x - centerX;
        const relativeY = y - centerY;

        // Calculate relative position centered around container center
        positionRef.current = { x: relativeX, y: relativeY };
      } else {
        const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
        const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
        positionRef.current = { x: x - centerX, y: y - centerY };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) {
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    // Listen for both mouse and touch events
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
};

