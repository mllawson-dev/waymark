import type { ReactNode, RefObject } from 'react';
import { useEffect, useId, useRef } from 'react';
import './Drawer.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  backgroundRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Drawer({ isOpen, onClose, title, children, backgroundRef }: DrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // On open: remember what had focus, then move focus into the dialog.
  // On close: return focus to whatever triggered the drawer.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
      if (backgroundRef?.current) backgroundRef.current.inert = true;
      document.body.style.overflow = 'hidden';
    } else {
      if (backgroundRef?.current) backgroundRef.current.inert = false;
      previouslyFocusedRef.current?.focus();
      document.body.style.overflow = '';
    }
    return () => {
      if (backgroundRef?.current) backgroundRef.current.inert = false;
      document.body.style.overflow = '';
    };
  }, [backgroundRef, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="wm-drawer-overlay" onClick={onClose}>
      <div
        className="wm-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wm-drawer__header">
          <h2 className="wm-drawer__title" id={titleId}>{title}</h2>
          <button className="wm-drawer__close" onClick={onClose} aria-label="Close" ref={closeButtonRef}>
            &times;
          </button>
        </div>
        <div className="wm-drawer__body">{children}</div>
      </div>
    </div>
  );
}
