import './StreakBadge.css';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak <= 0) return null;

  return (
    <div className="wm-streak-badge">
      {/* key forces a remount when streak changes, restarting the pop animation */}
      <span key={streak} className="wm-streak-badge__count wm-streak-badge__count--pop">
        {streak}
      </span>
      <span className="wm-streak-badge__label">day streak</span>
    </div>
  );
}
