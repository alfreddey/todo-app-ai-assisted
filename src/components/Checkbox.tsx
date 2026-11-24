import { TickIcon } from './Icons';

type Props = { checked: boolean; onChange: () => void; label: string; size?: number };

export function Checkbox({ checked, onChange, label, size = 20 }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`checkbox nodrag ${checked ? 'is-checked' : ''}`}
      style={{ width: size, height: size }}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
    >
      {checked && <TickIcon />}
    </button>
  );
}
