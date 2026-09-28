import './WaymarkLogo.css';

interface WaymarkLogoProps {
  size?: number;
}

const TERRACOTTA = '#C97C3D';
const INK = '#3D2E1F';

export function WaymarkLogo({ size = 40 }: WaymarkLogoProps) {
  if (size < 32) {
    return (
      <svg width={size} height={size} viewBox="-2 -2 28 28" role="img" aria-label="Waymark logo" className="wm-logo">
        <circle cx="12" cy="12" r="12" fill="none" stroke={TERRACOTTA} strokeWidth="2.5" />
        <path d="M12 3 L15.5 12 L12 12 Z" fill={TERRACOTTA} />
        <path d="M12 21 L8.5 12 L12 12 Z" fill={INK} />
      </svg>
    );
  }

  if (size < 52) {
    return (
      <svg width={size} height={size} viewBox="-2 -2 44 44" role="img" aria-label="Waymark logo" className="wm-logo">
        <circle cx="20" cy="20" r="20" fill="none" stroke={TERRACOTTA} strokeWidth="2.5" />
        <path d="M20 2 L26 20 L20 20 Z" fill={TERRACOTTA} />
        <path d="M20 38 L14 20 L20 20 Z" fill={INK} />
        <circle cx="20" cy="20" r="1.5" fill={INK} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="-2 -2 72 72" role="img" aria-label="Waymark logo" className="wm-logo">
      <circle cx="34" cy="34" r="34" fill="none" stroke={TERRACOTTA} strokeWidth="2.5" />
      <path d="M34 4 L42 34 L34 34 Z" fill={TERRACOTTA} />
      <path d="M34 64 L26 34 L34 34 Z" fill={INK} />
      <circle cx="34" cy="34" r="2.5" fill={INK} />
    </svg>
  );
}
