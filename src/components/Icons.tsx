/** Line-art icons drawn to match the whiteboard (round caps, ink stroke). */
type P = { size?: number };

export const PointerIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M6 3l12 9-6 1 3 6-2 1-3-6-4 4z" />
  </svg>
);

export const CardIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="15" rx="3" />
  </svg>
);

export const StickyIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <path d="M3 3h18v11l-7 7H3z M14 21v-7h7" />
  </svg>
);

export const ConnectorIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 18c7-16 9 7 16-9" />
    <circle cx="4" cy="18" r="2" fill="currentColor" strokeWidth="1" />
    <circle cx="20" cy="9" r="2" fill="currentColor" strokeWidth="1" />
  </svg>
);

export const PlusIcon = ({ size = 24 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M12 2v20M2 12h20" />
  </svg>
);

export const TickIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7.2l3.6 3.6 6.4-7.2" />
  </svg>
);
