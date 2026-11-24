import type { Card, Day, Project, Task } from './types';

export const project: Project = {
  title: 'Moving into Alder Street',
  shortTitle: 'Alder Street',
  today: '2026-11-24',
  moveDay: '2026-11-28',
};

export const tasks: Task[] = [
  // Today
  { id: 't1', title: 'Confirm van with Hollis Removals', note: 'Sat 8:00 · £185 paid', done: true },
  { id: 't2', title: 'Call Thames Water', note: 'Final meter reading, ref 40-1182', done: false },
  { id: 't3', title: 'Pack the bookshelf', note: '6 boxes · label the spines', done: false },
  { id: 't4', title: 'Return library books', note: 'Before 5pm, Kentish Town branch', done: false },
  { id: 't5', title: 'Order more packing tape', note: 'Arrives tomorrow', done: true },
  { id: 't6', title: 'Photograph every room', note: 'For the deposit check-out', done: false },
  // Paperwork
  { id: 'p1', title: 'Give notice to landlord', done: true },
  { id: 'p2', title: 'Register deposit transfer', done: true },
  { id: 'p3', title: 'Redirect post for 6 months', done: false },
  { id: 'p4', title: 'New address: bank, GP, DVLA', done: false },
  // Kitchen
  { id: 'k1', title: 'Defrost the freezer, Thu night', done: false },
  { id: 'k2', title: 'Wrap glasses in newspaper', done: false },
  { id: 'k3', title: 'Use up rice, lentils, frozen peas', done: false },
  // New flat
  { id: 'f1', title: 'Sofa is 210 cm, check the alcove', done: false },
  { id: 'f2', title: 'Book broadband install', done: false },
  { id: 'f3', title: 'Buy 3 curtain rods', done: false },
];

/** Shorter wording used on the phone, where the card is narrower. */
export const mobileTaskText: Record<string, { title?: string; note?: string }> = {
  t1: { title: 'Confirm the van' },
  t2: { note: 'Meter reading, ref 40-1182' },
  t4: { note: 'Before 5pm' },
};

export const cards: Card[] = [
  {
    id: 'today',
    kind: 'list',
    title: 'Today',
    subtitle: 'Tuesday, 24 November',
    taskIds: ['t1', 't2', 't3', 't4', 't5', 't6'],
    width: 400,
  },
  {
    id: 'paperwork',
    kind: 'list',
    title: 'Paperwork',
    showCount: true,
    compact: true,
    taskIds: ['p1', 'p2', 'p3', 'p4'],
    width: 350,
  },
  {
    id: 'kitchen',
    kind: 'list',
    title: 'Kitchen',
    compact: true,
    taskIds: ['k1', 'k2', 'k3'],
    width: 350,
  },
  {
    id: 'keys',
    kind: 'sticky',
    title: 'Keys handover',
    body: 'Friday 12:30 at Barrow & Lane. Bring both fobs and the meter photos.',
  },
  {
    id: 'flat',
    kind: 'flat',
    title: 'New flat',
    address: '14 Alder Street, 2nd floor',
    sofaWidthCm: 210,
    alcoveWidthCm: 212,
    taskIds: ['f1', 'f2', 'f3'],
  },
];

export const week: Day[] = [
  { date: '2026-11-23', label: 'Mon 23', event: 'Boxes arrived' },
  { date: '2026-11-24', label: 'Tue 24', event: 'Today' },
  { date: '2026-11-25', label: 'Wed 25' },
  { date: '2026-11-26', label: 'Thu 26', event: 'Defrost freezer' },
  { date: '2026-11-27', label: 'Fri 27', event: 'Keys 12:30' },
  { date: '2026-11-28', label: 'Sat 28', event: 'Move day', key: true },
  { date: '2026-11-29', label: 'Sun 29', event: 'Unpack kitchen' },
];

/** Dashed threads that pin a card to a day on the timeline. */
export const pins: { card: string; date: string }[] = [
  { card: 'today', date: '2026-11-24' },
  { card: 'kitchen', date: '2026-11-26' },
  { card: 'flat', date: '2026-11-28' },
];
