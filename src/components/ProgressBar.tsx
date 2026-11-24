type Props = { done: number; total: number; width?: number | string; className?: string };

export function ProgressBar({ done, total, width = 110, className = '' }: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div
      className={`progress ${className}`}
      style={{ width }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label={`${done} of ${total} done`}
    >
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
