import { useStore } from '../data/store';
import { Checkbox } from './Checkbox';

type Props = { id: string; compact?: boolean; small?: boolean; override?: { title?: string; note?: string }; boxSize?: number };

export function TaskRow({ id, compact, small, override, boxSize }: Props) {
  const { tasks, toggle } = useStore();
  const task = tasks[id];
  if (!task) return null;
  const title = override?.title ?? task.title;
  const note = override?.note ?? task.note;
  return (
    <li className={`task ${compact ? 'task--compact' : ''} ${small ? 'task--small' : ''} ${task.done ? 'is-done' : ''}`}>
      <Checkbox checked={task.done} onChange={() => toggle(id)} label={title} size={boxSize} />
      <div className="task__text">
        <span className="task__title">{title}</span>
        {!compact && note && <span className="task__note">{note}</span>}
      </div>
    </li>
  );
}
