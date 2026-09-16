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
      className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[rgba(14,165,233,0.12)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-[rgba(99,102,241,0.08)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[rgba(34,197,94,0.07)] blur-3xl"
      />
      <h1 className="text-3xl font-semibold tracking-tight text-accent">{title}</h1>
      <p className="max-w-md text-center text-slate-500">{description}</p>
      <Button size="lg" onClick={() => navigate('/build')}>
        {cta}
      </Button>
    </motion.div>
  );
}
