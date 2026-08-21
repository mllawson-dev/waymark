import { useRef, useState } from 'react';
import './VerseCard.css';

interface VerseCardProps {
  reference: string;
  text: string;
}

export function VerseCard({ reference, text }: VerseCardProps) {
  const [revealed, setRevealed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  function handleReveal() {
    setRevealed(true);
    // Move focus to the revealed content so keyboard/screen-reader users
    // land somewhere sensible instead of losing focus to <body>.
    requestAnimationFrame(() => contentRef.current?.focus());
  }

  return (
    <div className={`wm-verse-card ${revealed ? 'wm-verse-card--revealed' : ''}`}>
      {!revealed ? (
        <button
          className="wm-verse-card__trigger"
          onClick={handleReveal}
          aria-expanded={revealed}
        >
          <span className="wm-verse-card__glow" aria-hidden="true" />
          <span className="wm-verse-card__trigger-label">Reveal today's verse</span>
          <span className="wm-verse-card__trigger-ref">{reference}</span>
        </button>
      ) : (
        <div className="wm-verse-card__content" ref={contentRef} tabIndex={-1}>
          <p className="wm-verse-card__text">&ldquo;{text}&rdquo;</p>
          <p className="wm-verse-card__reference">{reference}</p>
        </div>
      )}
    </div>
  );
}
