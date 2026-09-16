import { createRoot } from 'react-dom/client';

import App from '@/app/App';
import '@xyflow/react/dist/style.css';
import '@/styles/globals.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<App />);
}
