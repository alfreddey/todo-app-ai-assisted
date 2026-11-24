import { useCallback, useMemo, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { project, week, pins } from '../data/mockData';
import { useStore } from '../data/store';
import { FlatCardView, ListCardView, StickyNote } from './Cards';
import { Timeline } from './Timeline';
import { ToolPill, type Tool } from './ToolPill';
import { ProgressBar } from './ProgressBar';

type CardNodeData = { cardId: string; pinX?: number };
type CardNode = Node<CardNodeData, 'card'>;
type TimelineNode = Node<{ selected?: string; onSelect?: (d: string) => void }, 'timeline'>;

/** Where the dashed thread leaves each card, measured from the whiteboard. */
const PIN_X: Record<string, number> = { today: 230, kitchen: 190, flat: 150 };

function CardNodeView({ data }: NodeProps<CardNode>) {
  const { cards } = useStore();
  const card = cards.find((c) => c.id === data.cardId);
  if (!card) return null;
  return (
    <div className="node-wrap">
      <Handle type="target" position={Position.Top} className="card-handle" />
      {card.kind === 'list' && <ListCardView card={card} />}
      {card.kind === 'sticky' && <StickyNote card={card} />}
      {card.kind === 'flat' && <FlatCardView card={card} />}
      <Handle type="source" position={Position.Bottom} id="pin" className="card-handle" style={data.pinX != null ? { left: data.pinX } : undefined} />
    </div>
  );
}

function TimelineNodeView({ data }: NodeProps<TimelineNode>) {
  return <Timeline days={week} today={project.today} selected={data.selected} onSelect={data.onSelect} />;
}

const nodeTypes = { card: CardNodeView, timeline: TimelineNodeView };

/** Card positions on the canvas, taken from the whiteboard (window top-left minus the 72px header). */
const LAYOUT: Record<string, { x: number; y: number }> = {
  today: { x: 70, y: 40 },
  paperwork: { x: 530, y: 40 },
  kitchen: { x: 530, y: 330 },
  keys: { x: 946, y: 30 },
  flat: { x: 940, y: 228 },
};

const threadStyle = { stroke: 'var(--ink)', strokeWidth: 1.6, strokeDasharray: '5 6' };

function initialNodes(cardIds: string[]): Node[] {
  const nodes: Node[] = cardIds.map((id) => ({
    id,
    type: 'card',
    position: LAYOUT[id] ?? { x: 200, y: 200 },
    data: { cardId: id, pinX: PIN_X[id] },
  }));
  nodes.push({ id: 'timeline', type: 'timeline', position: { x: 70, y: 540 }, data: {}, draggable: false, selectable: false, zIndex: -1 });
  return nodes;
}

const initialEdges: Edge[] = pins.map((p) => ({
  id: `pin-${p.card}`,
  source: p.card,
  sourceHandle: 'pin',
  target: 'timeline',
  targetHandle: p.date,
  style: threadStyle,
}));

function Canvas() {
  const { cards, addCard } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(useMemo(() => initialNodes(cards.map((c) => c.id)), []));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [tool, setTool] = useState<Tool>('pointer');
  const [selectedDay, setSelectedDay] = useState(project.today);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge({ ...c, style: threadStyle }, eds)),
    [setEdges],
  );

  const pick = (t: Tool) => {
    if (t === 'card' || t === 'sticky') {
      const card = addCard(t === 'card' ? 'list' : 'sticky');
      const pos = screenToFlowPosition({ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 80 });
      setNodes((ns) => [...ns, { id: card.id, type: 'card', position: pos, data: { cardId: card.id }, selected: true }]);
      setTool('pointer');
      return;
    }
    setTool(t);
  };

  const withTimeline = nodes.map((n) => (n.id === 'timeline' ? { ...n, data: { selected: selectedDay, onSelect: setSelectedDay } } : n));

  return (
    <div className={`canvas ${tool === 'connector' ? 'is-connecting' : ''}`}>
      <ReactFlow
        nodes={withTimeline}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesConnectable={tool === 'connector'}
        fitView
        fitViewOptions={{ padding: 0.04, maxZoom: 1 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ style: threadStyle }}
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={2.6} color="#d9d2c8" bgColor="var(--paper)" />
      </ReactFlow>
      <div className="desktop-tools">
        <ToolPill active={tool} onPick={pick} />
      </div>
    </div>
  );
}

export function DesktopCanvas() {
  const { doneCount, totalCount } = useStore();
  return (
    <div className="desktop">
      <header className="app-header">
        <h1 className="app-title">{project.title}</h1>
        <div className="app-header__progress">
          <span className="muted small">
            {doneCount} of {totalCount} done
          </span>
          <ProgressBar done={doneCount} total={totalCount} />
        </div>
      </header>
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </div>
  );
}
