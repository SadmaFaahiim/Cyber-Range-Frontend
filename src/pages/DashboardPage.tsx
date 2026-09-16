import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { APP_STRINGS } from '@/lib/strings';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { title, description, cta } = APP_STRINGS.PAGES.DASHBOARD;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col items-center justify-center gap-4 p-6"
    >
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="max-w-md text-center text-muted-foreground">{description}</p>
      <Button size="lg" onClick={() => navigate('/build')}>
        {cta}
      </Button>
    </motion.div>
  );
}
