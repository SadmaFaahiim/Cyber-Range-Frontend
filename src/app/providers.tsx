import { type ReactNode, StrictMode } from 'react';
import { BrowserRouter } from 'react-router';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <BrowserRouter>{children}</BrowserRouter>
    </StrictMode>
  );
}
