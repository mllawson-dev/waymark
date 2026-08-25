import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/classNames';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = cx('wm-button', `wm-button--${variant}`, `wm-button--${size}`, className);

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
