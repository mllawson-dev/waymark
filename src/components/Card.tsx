import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/classNames';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, padded = true, className = '', ...rest }: CardProps) {
  const classes = cx('wm-card', padded && 'wm-card--padded', className);

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="wm-card__image">
      <img src={src} alt={alt} />
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="wm-card__title">{children}</h3>;
}

export function CardBody({ children }: { children: ReactNode }) {
  return <p className="wm-card__body">{children}</p>;
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="wm-card__footer">{children}</div>;
}
