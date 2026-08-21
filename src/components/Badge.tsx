import type { HTMLAttributes, ReactNode } from 'react';
import './Badge.css';

type BadgeTone = 'accent' | 'sage' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className = '', children, ...rest }: BadgeProps) {
  const classes = ['wm-badge', `wm-badge--${tone}`, className].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
