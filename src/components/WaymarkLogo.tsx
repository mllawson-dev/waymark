import './WaymarkLogo.css';

interface WaymarkLogoProps {
  size?: number;
  northColor?: string;
  southColor?: string;
  ringColor?: string;
}

export function WaymarkLogo({
  size = 40,
  northColor = 'var(--color-accent)',
  southColor = 'var(--color-text-primary)',
  ringColor = 'var(--color-accent)',
}: WaymarkLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      role="img"
      aria-label="Waymark logo"
      className="wm-logo"
    >
      <circle
        cx="30"
        cy="30"
        r="24"
        fill="none"
        stroke={ringColor}
        strokeWidth="2.5"
      />
      {/* North half of needle */}
      <path className="wm-logo__needle" d="M30 14 L36 30 L30 30 Z" fill={northColor} />
      {/* South half of needle */}
      <path className="wm-logo__needle" d="M30 46 L24 30 L30 30 Z" fill={southColor} />
      <circle cx="30" cy="30" r="1.75" fill={southColor} />
    </svg>
  );
}
