"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useAnimationFrame } from "motion/react";

import { cn } from "@/lib/utils";
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";

interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void;
  unregisterElement: (id: string) => void;
}

const FloatingContext = createContext<FloatingContextType | null>(null);

interface FloatingProps {
  children: ReactNode;
  className?: string;
  sensitivity?: number;
  easingFactor?: number;
}

const Floating = ({
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.05,
  ...props
}: FloatingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsMap = useRef(
    new Map<
      string,
      {
        element: HTMLDivElement;
        depth: number;
        currentPosition: { x: number; y: number };
      }
    >()
  );
  const mousePositionRef = useMousePositionRef(containerRef);

  const registerElement = useCallback(
    (id: string, element: HTMLDivElement, depth: number) => {
      // PRESERVE existing currentPosition so elements NEVER snap or jitter on re-renders
      const existing = elementsMap.current.get(id);
      elementsMap.current.set(id, {
        element,
        depth,
        currentPosition: existing ? existing.currentPosition : { x: 0, y: 0 },
      });
    },
    []
  );

  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id);
  }, []);

  useAnimationFrame(() => {
    if (!containerRef.current) return;

    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20;

      // Calculate new target position
      const newTargetX = mousePositionRef.current.x * strength;
      const newTargetY = mousePositionRef.current.y * strength;

      // Check if we need to update
      const dx = newTargetX - data.currentPosition.x;
      const dy = newTargetY - data.currentPosition.y;

      // Update position only if we're still moving
      data.currentPosition.x += dx * easingFactor;
      data.currentPosition.y += dy * easingFactor;

      data.element.style.transform = `translate3d(${data.currentPosition.x.toFixed(2)}px, ${data.currentPosition.y.toFixed(2)}px, 0)`;
    });
  });

  const contextValue = useMemo(
    () => ({ registerElement, unregisterElement }),
    [registerElement, unregisterElement]
  );

  return (
    <FloatingContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("absolute top-0 left-0 w-full h-full", className)}
        {...props}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  );
};

export default Floating;

interface FloatingElementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export const FloatingElement = ({
  children,
  className,
  depth = 1,
  style,
  ...props
}: FloatingElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(FloatingContext);

  const registerElement = context?.registerElement;
  const unregisterElement = context?.unregisterElement;

  useEffect(() => {
    if (!elementRef.current || !registerElement || !unregisterElement) return;

    const nonNullDepth = depth ?? 0.01;
    registerElement(idRef.current, elementRef.current, nonNullDepth);

    return () => unregisterElement(idRef.current);
  }, [depth, registerElement, unregisterElement]);

  return (
    <div
      ref={elementRef}
      style={style}
      className={cn("absolute will-change-transform", className)}
      {...props}
    >
      {children}
    </div>
  );
};
