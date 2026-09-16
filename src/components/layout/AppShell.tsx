import { type ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import useCyberRangeStore from '@/store/cyberRangeStore';

import Header from './Header';

export default function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = useCyberRangeStore((state) => state.currentStep);

  useEffect(() => {
    if (location.pathname === '/review' && currentStep < 2) {
      navigate('/build', { replace: true });
      return;
    }
    if (location.pathname === '/ready' && currentStep < 3) {
      navigate('/review', { replace: true });
    }
  }, [currentStep, location.pathname, navigate]);

  return (
    <div className="flex h-screen flex-col bg-app-bg">
      <Header />
      <main className="flex flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
