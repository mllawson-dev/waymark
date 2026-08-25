import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/classNames';
import './Badge.css';

type BadgeTone = 'accent' | 'sage' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className = '', children, ...rest }: BadgeProps) {
  const classes = cx('wm-badge', `wm-badge--${tone}`, className);
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
