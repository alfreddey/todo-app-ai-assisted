import { useState, type ReactNode } from 'react';
import { useStore } from '../data/store';
import type { FlatCard, ListCard, StickyCard } from '../data/types';
import { TaskRow } from './TaskRow';

/** A white card with the offset "stacked paper" outline from the whiteboard. */
export function Paper({ children, width, className = '' }: { children: ReactNode; width?: number; className?: string }) {
  return (
    <div className={`paper ${className}`} style={{ width }}>
      {children}
    </div>
  );
}

export function ListCardView({
  card,
  aside,
  overrides,
  mobile,
}: {
  card: ListCard;
  aside?: ReactNode;
  overrides?: Record<string, { title?: string; note?: string }>;
  mobile?: boolean;
}) {
  const { tasks, addTask } = useStore();
  const [draft, setDraft] = useState('');
  const done = card.taskIds.filter((id) => tasks[id]?.done).length;
  return (
    <Paper width={card.width} className={`list-card ${card.compact ? 'list-card--compact' : ''} ${mobile ? 'list-card--mobile' : ''}`}>
      <header className="card-head">
        <div>
          <h2 className="card-title">{card.title}</h2>
          {card.subtitle && <p className="card-sub">{card.subtitle}</p>}
        </div>
        {card.showCount && (
          <span className="count-pill">
            {done} / {card.taskIds.length}
          </span>
        )}
        {aside}
      </header>
      <ul className="task-list nowheel">
        {card.taskIds.map((id) => (
          <TaskRow key={id} id={id} compact={card.compact} override={overrides?.[id]} boxSize={mobile ? 22 : 20} />
        ))}
      </ul>
      {card.taskIds.length === 0 && (
        <form
          className="add-task nodrag"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) addTask(card.id, draft.trim());
            setDraft('');
          }}
        >
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a task and press Enter" />
        </form>
      )}
    </Paper>
  );
}

export function StickyNote({ card, rotate = 0, width = 228 }: { card: StickyCard; rotate?: number; width?: number }) {
  return (
    <div className="sticky" style={{ width, transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
      {/* Slightly crooked paper with a folded corner, traced from the whiteboard. */}
      <svg className="sticky__paper" viewBox="0 0 228 174" preserveAspectRatio="none" aria-hidden>
        <path d="M2 8L224 2L228 150L202 172L8 176Z" fill="var(--sticky)" stroke="var(--ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d="M202 172L206 152L228 150" fill="var(--sticky-fold)" stroke="var(--ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <span className="sticky__tape" aria-hidden />
      <p className="sticky__title">{card.title}</p>
      <p className="sticky__body">{card.body}</p>
    </div>
  );
}

/** Floor plan of the new flat, traced from the whiteboard drawing. */
function FloorPlan({ alcove }: { alcove: number }) {
  return (
    <svg className="floor-plan" width="170" height="190" viewBox="16 90 170 190" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-label="Floor plan of the new flat">
      <path d="M26 100h150v120h-40v40h-110z" strokeWidth="2.2" />
      <path d="M46 100h50" stroke="#fff" strokeWidth="4" />
      <path d="M46 97h50M46 103h50" strokeWidth="1.2" />
      <path d="M26 220v30" stroke="#fff" strokeWidth="4" />
      <path d="M26 220l26 -6" strokeWidth="1.4" />
      <path d="M52 214A30 30 0 0 1 55 247" strokeWidth="1" strokeDasharray="3 3" />
      <rect className="floor-plan__sofa" x="36" y="164" width="96" height="42" rx="6" stroke="var(--accent)" strokeWidth="1.8" strokeDasharray="6 4" />
      <path d="M176 220h-40" strokeWidth="2.2" />
      <path d="M26 274h150M26 268v12M176 268v12" strokeWidth="1.2" />
      <title>{`Alcove ${alcove} cm`}</title>
    </svg>
  );
}

export function FlatCardView({ card }: { card: FlatCard }) {
  return (
    <Paper width={380} className="flat-card">
      <h2 className="card-title">{card.title}</h2>
      <p className="card-sub">{card.address}</p>
      <div className="flat-card__body">
        <div className="flat-card__plan">
          <FloorPlan alcove={card.alcoveWidthCm} />
          <span className="flat-card__dim">{card.alcoveWidthCm} cm</span>
        </div>
        <ul className="task-list flat-card__tasks">
          {card.taskIds.map((id) => (
            <TaskRow key={id} id={id} compact small boxSize={18} />
          ))}
        </ul>
      </div>
    </Paper>
  );
}
