import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="40"
      height="40"
      aria-label="7K Life Logo"
      {...props}
    >
      {/* Tower Group - drawn first to be in the background */}
      <g>
        {/* Tower Base */}
        <path d="M42 95 V 75 H 58 V 95 Z" fill="hsl(var(--secondary))" />
        {/* Main Tower Body */}
        <path d="M44 75 V 35 H 56 V 75 Z" fill="hsl(var(--primary))" />
        {/* Roof */}
        <path d="M42 35 L 58 35 L 50 10 Z" fill="hsl(var(--primary))" />
        {/* Shadow on tower */}
        <path d="M44 75 V 35 H 50 V 75 Z" fill="hsl(var(--secondary))" opacity="0.4" />
        {/* Window */}
        <rect x="51" y="60" width="3" height="5" fill="hsl(var(--background))" />
      </g>
      
      {/* 7K Text Shapes - drawn last to be in the foreground */}
      <g fill="hsl(var(--foreground))">
        {/* The "7" */}
        <path d="M 5 20 L 48 20 L 40 32 L 25 80 L 10 80 L 22 32 L 5 32 Z" />
        {/* The "K" */}
        <path d="M 52 20 H 67 V 80 H 52 Z" />
        <path d="M 67 50 L 95 20 L 95 35 L 72 50 L 95 65 L 95 80 L 67 50 Z" />
      </g>
    </svg>
  );
}
