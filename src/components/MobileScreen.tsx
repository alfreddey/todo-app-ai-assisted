import { useMemo, useRef, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { mobileTaskText, project, week } from '../data/mockData';
import { useStore } from '../data/store';
import type { ListCard } from '../data/types';
import { ListCardView, StickyNote } from './Cards';
import { PlusIcon } from './Icons';
import { ProgressBar } from './ProgressBar';
import { ToolPill, type Tool } from './ToolPill';

const daysUntil = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);

function WeekStrip({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  return (
    <nav className="week-strip" aria-label="This week">
      {week.map((d) => {
        const isToday = d.date === project.today;
        const isPast = d.date < project.today;
        const hasDot = !!d.event && d.date > project.today && d.date <= project.moveDay;
        const cls = ['wday', isToday && 'wday--today', isPast && 'wday--past', d.key && 'wday--key', selected === d.date && 'is-selected']
          .filter(Boolean)
          .join(' ');
        return (
          <button key={d.date} type="button" className={cls} onClick={() => onSelect(d.date)} aria-label={`${d.label}${d.event ? `, ${d.event}` : ''}`}>
            <span className="wday__num">{d.date.slice(-2)}</span>
            <span className={`wday__dot ${hasDot ? 'is-on' : ''}`} aria-hidden />
          </button>
        );
      })}
    </nav>
  );
}

type MNode = Node<{ cardId: string; variant?: 'today' | 'peek' }, 'mcard'>;

function MobileCardNode({ data }: NodeProps<MNode>) {
  const { cards } = useStore();
  const card = cards.find((c) => c.id === data.cardId);
  if (!card) return null;
  return (
    <div className="node-wrap">
      <Handle type="target" position={Position.Top} className="card-handle" />
      {card.kind === 'list' &&
        (data.variant === 'today' ? (
          <ListCardView
            mobile
            card={{ ...card, subtitle: undefined, width: 300 } as ListCard}
            overrides={mobileTaskText}
            aside={<span className="muted small card-aside">Tue 24</span>}
          />
        ) : (
          <ListCardView mobile card={{ ...card, width: data.variant === 'peek' ? 240 : 280 } as ListCard} />
        ))}
      {card.kind === 'sticky' && <StickyNote card={{ ...card, body: 'Fri 12:30, both fobs + meter photos' }} width={226} />}
      <Handle type="source" position={Position.Bottom} className="card-handle" style={{ left: 92 }} />
    </div>
  );
}

const nodeTypes = { mcard: MobileCardNode };
const threadStyle = { stroke: 'var(--ink)', strokeWidth: 1.6, strokeDasharray: '5 6' };

function MobileCanvas({ width }: { width: number }) {
  const { addCard, addTask } = useStore();
  const { screenToFlowPosition } = useReactFlow();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    useMemo(
      () => [
        { id: 'kitchen', type: 'mcard', position: { x: width - 82, y: 312 }, data: { cardId: 'kitchen', variant: 'peek' } },
        { id: 'today', type: 'mcard', position: { x: 12, y: 20 }, data: { cardId: 'today', variant: 'today' } },
        { id: 'keys', type: 'mcard', position: { x: 24, y: 398 }, data: { cardId: 'keys' } },
      ],
      [width],
    ),
  );
  const edges: Edge[] = [{ id: 'today-keys', source: 'today', target: 'keys', style: threadStyle }];
  const [tool, setTool] = useState<Tool>('card');
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState('');

  const pick = (t: Tool) => {
    setTool(t);
    if (t === 'card' || t === 'sticky') {
      const card = addCard(t === 'card' ? 'list' : 'sticky');
      const r = wrapRef.current?.getBoundingClientRect();
      const pos = screenToFlowPosition({ x: (r?.left ?? 0) + 40, y: (r?.top ?? 0) + 60 });
      setNodes((ns) => [...ns, { id: card.id, type: 'mcard', position: pos, data: { cardId: card.id } }]);
    }
  };

  return (
    <div className="m-canvas" ref={wrapRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        nodesConnectable={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.4}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={2.6} color="#d9d2c8" bgColor="var(--paper)" />
      </ReactFlow>

      <div className="m-dock">
        <ToolPill orientation="horizontal" active={tool} onPick={pick} tools={['card', 'sticky', 'connector']} />
        <button type="button" className="fab" aria-label="Add a task for today" onClick={() => setSheet(true)}>
          <PlusIcon />
        </button>
      </div>

      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(false)}>
          <form
            className="sheet paper"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) addTask('today', draft.trim());
              setDraft('');
              setSheet(false);
            }}
          >
            <p className="card-title sheet__title">Add to Today</p>
            <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. Buy bubble wrap" />
            <button type="submit" className="sheet__btn">
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function MobileScreen({ width }: { width: number }) {
  const { doneCount, totalCount } = useStore();
  const [selected, setSelected] = useState(project.today);
  return (
    <div className="mobile">
      <header className="m-header">
        <h1 className="m-title">{project.shortTitle}</h1>
        <p className="muted small">
          {doneCount} of {totalCount} done · move in {daysUntil(project.today, project.moveDay)} days
        </p>
        <ProgressBar done={doneCount} total={totalCount} width="100%" className="m-progress" />
      </header>
      <WeekStrip selected={selected} onSelect={setSelected} />
      <ReactFlowProvider>
        <MobileCanvas width={width} />
      </ReactFlowProvider>
    </div>
  );
}
