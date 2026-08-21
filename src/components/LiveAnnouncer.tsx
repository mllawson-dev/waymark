interface LiveAnnouncerProps {
  message: string;
}

/**
 * A visually-hidden aria-live region for announcing state changes (like
 * "Added to cart") that happen without a page navigation or focus move,
 * so screen reader users get confirmation no matter where focus is.
 */
export function LiveAnnouncer({ message }: LiveAnnouncerProps) {
  return (
    <div aria-live="polite" role="status" className="wm-visually-hidden">
      {message}
    </div>
  );
}
