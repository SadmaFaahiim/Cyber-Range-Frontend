import { createRoot } from 'react-dom/client';

import App from '@/app/App';
import useCyberRangeStore from '@/store/cyberRangeStore';
import '@xyflow/react/dist/style.css';
import '@/styles/globals.css';

declare global {
  interface Window {
    __cyberRangeStore?: typeof useCyberRangeStore;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  window.__cyberRangeStore = useCyberRangeStore;
  createRoot(rootElement).render(<App />);
}
