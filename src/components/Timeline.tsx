import { Handle, Position } from '@xyflow/react';
import type { Day } from '../data/types';

export const TIMELINE_WIDTH = 1250;
export const DAY_SPACING = 190;
export const FIRST_DAY_X = 50;
export const LINE_Y = 88;

type Props = { days: Day[]; today: string; selected?: string; onSelect?: (date: string) => void };

/** "This week": a line with seven day dots. Cards are pinned to dots with dashed threads. */
export function Timeline({ days, today, selected, onSelect }: Props) {
  return (
    <div className="timeline" style={{ width: TIMELINE_WIDTH }}>
      <p className="timeline__label">This week</p>
      <div className="timeline__line" style={{ top: LINE_Y }} />
      {days.map((d, i) => {
        const x = FIRST_DAY_X + i * DAY_SPACING;
        const isToday = d.date === today;
        const isPast = d.date < today;
        const cls = ['day', isToday && 'day--today', isPast && 'day--past', d.key && 'day--key', selected === d.date && 'is-selected']
          .filter(Boolean)
          .join(' ');
        return (
          <div key={d.date} className={cls} style={{ left: x }}>
            <Handle type="target" position={Position.Top} id={d.date} className="day__handle" style={{ left: 0, top: LINE_Y - 12 }} />
            <button type="button" className="day__dot nodrag" style={{ top: LINE_Y }} aria-label={d.label} onClick={() => onSelect?.(d.date)} />
            <span className="day__date">{d.label}</span>
            {d.event && <span className="day__event">{d.key ? <strong>{d.event}</strong> : d.event}</span>}
          </div>
        );
      })}
    </div>
  );
}
