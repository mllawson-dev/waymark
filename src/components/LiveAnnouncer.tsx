interface LiveAnnouncerProps {
  message: string;
  /** Change to force a re-announcement when the message text itself is identical. */
  nonce?: number;
}

/**
 * A visually-hidden aria-live region for announcing state changes (like
 * "Added to cart") that happen without a page navigation or focus move,
 * so screen reader users get confirmation no matter where focus is.
 */
export function LiveAnnouncer({ message, nonce = 0 }: LiveAnnouncerProps) {
  return (
    <div aria-live="polite" role="status" className="wm-visually-hidden">
      <span key={`${nonce}:${message}`}>{message}</span>
    </div>
  );
}
