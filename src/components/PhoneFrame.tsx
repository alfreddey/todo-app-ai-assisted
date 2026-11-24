import type { ReactNode } from 'react';

/** Phone body used to preview the mobile screen on a wide display (?view=mobile). */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-stage">
      <div className="phone">
        <div className="phone__screen">
          <div className="statusbar">
            <strong>12:19</strong>
            <span className="statusbar__island" aria-hidden />
            <span className="statusbar__icons" aria-hidden>
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M2 13v-3M8 13v-6M14 13v-9M20 13v-12" />
              </svg>
              <svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="1" y="1" width="25" height="13" rx="4" />
                <rect x="4" y="4" width="15" height="7" rx="1.5" fill="currentColor" stroke="none" />
                <path d="M28.5 5v5" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          {children}
          <span className="home-indicator" aria-hidden />
        </div>
      </div>
    </div>
  );
}
