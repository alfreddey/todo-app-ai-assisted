import { CardIcon, ConnectorIcon, PointerIcon, StickyIcon } from './Icons';

export type Tool = 'pointer' | 'card' | 'sticky' | 'connector';

type Props = {
  active: Tool;
  onPick: (t: Tool) => void;
  orientation?: 'vertical' | 'horizontal';
  tools?: Tool[];
};

const META: Record<Tool, { label: string; icon: JSX.Element }> = {
  pointer: { label: 'Select and move', icon: <PointerIcon /> },
  card: { label: 'Add a list card', icon: <CardIcon /> },
  sticky: { label: 'Add a sticky note', icon: <StickyIcon /> },
  connector: { label: 'Pin a card to a day', icon: <ConnectorIcon /> },
};

export function ToolPill({ active, onPick, orientation = 'vertical', tools = ['pointer', 'card', 'sticky', 'connector'] }: Props) {
  return (
    <div className={`tool-pill tool-pill--${orientation}`} role="toolbar" aria-label="Canvas tools">
      {tools.map((t) => (
        <button
          key={t}
          type="button"
          className={`tool ${active === t ? 'is-active' : ''}`}
          aria-label={META[t].label}
          aria-pressed={active === t}
          title={META[t].label}
          onClick={() => onPick(t)}
        >
          {META[t].icon}
        </button>
      ))}
      {orientation === 'horizontal' && <span className="tool-pill__divider" aria-hidden />}
    </div>
  );
}
