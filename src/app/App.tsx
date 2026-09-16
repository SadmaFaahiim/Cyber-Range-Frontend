import AppShell from '@/components/layout/AppShell';

import Providers from './providers';
import AppRouter from './router';

export function App() {
  return (
    <Providers>
      <AppShell>
        <AppRouter />
      </AppShell>
    </Providers>
  );
}

export default App;
