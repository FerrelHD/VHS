"use client";

import React from "react";

interface RevealProps {
  on?: boolean;
  i?: number;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Masked staggered text reveal component (100% Arc Marumo authentic).
 * Slides up from translateY(115%) with cubic-bezier(0.16, 1, 0.3, 1).
 * Staggered by 70ms per index i.
 */
export function Reveal({
  on = true,
  i = 0,
  inline = false,
  className = "",
  children,
}: RevealProps) {
  return (
    <span className={`${inline ? "rv-inline" : "rv"} ${className}`}>
      <span
        className={`rv-i ${on ? "rv-in" : ""}`}
        style={{
          transitionDelay: `${70 * i}ms`,
        }}
      >
        {children}
      </span>
    </span>
  );
}
