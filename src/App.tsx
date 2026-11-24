import { useEffect, useState } from 'react';
import { DesktopCanvas } from './components/DesktopCanvas';
import { MobileScreen } from './components/MobileScreen';
import { PhoneFrame } from './components/PhoneFrame';
import { StoreProvider } from './data/store';

const PHONE_BREAKPOINT = 720;
const FRAME_WIDTH = 368;

function useWidth() {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}

export default function App() {
  const width = useWidth();
  const forced = new URLSearchParams(window.location.search).get('view');
  const isPhone = width <= PHONE_BREAKPOINT;
  const view = forced === 'mobile' || forced === 'desktop' ? forced : isPhone ? 'mobile' : 'desktop';

  return (
    <StoreProvider>
      {view === 'desktop' && <DesktopCanvas />}
      {view === 'mobile' && isPhone && <MobileScreen width={width} />}
      {view === 'mobile' && !isPhone && (
        <PhoneFrame>
          <MobileScreen width={FRAME_WIDTH} />
        </PhoneFrame>
      )}
    </StoreProvider>
  );
}
