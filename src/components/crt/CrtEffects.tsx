"use client";

export function CrtGrain() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" aria-hidden="true">
      <div className="grain-layer" />
    </div>
  );
}

export function CrtRoll() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" aria-hidden="true">
      <div className="vhs-crt-roll" />
    </div>
  );
}

