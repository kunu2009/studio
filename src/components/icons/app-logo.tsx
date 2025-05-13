import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="40"
      height="40"
      aria-label="Zenith Zone Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.7 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logoGradient)"
        d="M50 5 A45 45 0 0 1 95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 A45 45 0 0 1 50 5 Z M50 15 A35 35 0 0 0 15 50 A35 35 0 0 0 50 85 A35 35 0 0 0 85 50 A35 35 0 0 0 50 15 Z"
      />
      <text
        x="50"
        y="60"
        fontFamily="var(--font-geist-sans), Segoe UI, sans-serif"
        fontSize="40"
        fill="hsl(var(--primary-foreground))"
        textAnchor="middle"
        fontWeight="bold"
      >
        Z
      </text>
    </svg>
  );
}
