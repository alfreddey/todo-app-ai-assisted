import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { tasks as initialTasks, cards as initialCards } from './mockData';
import type { Card, Task } from './types';

type Store = {
  tasks: Record<string, Task>;
  cards: Card[];
  toggle: (id: string) => void;
  addTask: (cardId: string, title: string) => void;
  addCard: (kind: 'list' | 'sticky') => Card;
  doneCount: number;
  totalCount: number;
};

const StoreContext = createContext<Store | null>(null);

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Record<string, Task>>(() =>
    Object.fromEntries(initialTasks.map((t) => [t.id, t])),
  );
  const [cards, setCards] = useState<Card[]>(initialCards);

  const toggle = useCallback((id: string) => {
    setTasks((prev) => ({ ...prev, [id]: { ...prev[id], done: !prev[id].done } }));
  }, []);

  const addTask = useCallback((cardId: string, title: string) => {
    const id = uid('task');
    setTasks((prev) => ({ ...prev, [id]: { id, title, done: false } }));
    setCards((prev) =>
      prev.map((c) => (c.id === cardId && c.kind !== 'sticky' ? { ...c, taskIds: [...c.taskIds, id] } : c)),
    );
  }, []);

  const addCard = useCallback((kind: 'list' | 'sticky') => {
    const card: Card =
      kind === 'list'
        ? { id: uid('card'), kind: 'list', title: 'New list', compact: true, taskIds: [], width: 320 }
        : { id: uid('note'), kind: 'sticky', title: 'Note', body: 'Write something…' };
    setCards((prev) => [...prev, card]);
    return card;
  }, []);

  const value = useMemo(() => {
    const all = Object.values(tasks);
    return {
      tasks,
      cards,
      toggle,
      addTask,
      addCard,
      doneCount: all.filter((t) => t.done).length,
      totalCount: all.length,
    };
  }, [tasks, cards, toggle, addTask, addCard]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore must be used inside <StoreProvider>');
  return s;
}
