import { AnimatePresence } from 'motion/react';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const InfrastructureBuilderPage = lazy(() => import('@/pages/InfrastructureBuilderPage'));
const ReviewPage = lazy(() => import('@/pages/ReviewPage'));
const ReadinessPage = lazy(() => import('@/pages/ReadinessPage'));

function AppRouter() {
  const location = useLocation();

  return (
    <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/build" element={<InfrastructureBuilderPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/ready" element={<ReadinessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AppRouter;
