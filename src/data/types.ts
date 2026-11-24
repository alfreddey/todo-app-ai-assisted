export type Task = {
  id: string;
  title: string;
  /** Short grey line under the title, e.g. "Sat 8:00 · £185 paid". */
  note?: string;
  done: boolean;
};

export type ListCard = {
  id: string;
  kind: 'list';
  title: string;
  /** Small grey line under the title, e.g. "Tuesday, 24 November". */
  subtitle?: string;
  /** Show a "2 / 4" style pill next to the title. */
  showCount?: boolean;
  /** Compact rows (title only) like Paperwork and Kitchen. */
  compact?: boolean;
  taskIds: string[];
  width: number;
};

export type StickyCard = {
  id: string;
  kind: 'sticky';
  title: string;
  body: string;
};

export type FlatCard = {
  id: string;
  kind: 'flat';
  title: string;
  address: string;
  sofaWidthCm: number;
  alcoveWidthCm: number;
  taskIds: string[];
};

export type Card = ListCard | StickyCard | FlatCard;

export type Day = {
  /** ISO date, e.g. "2026-11-24". */
  date: string;
  label: string;
  event?: string;
  /** Highlighted in terracotta (move day). */
  key?: boolean;
};

export type Project = {
  title: string;
  shortTitle: string;
  today: string;
  moveDay: string;
};
