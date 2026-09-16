import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { pageTransition } from '@/lib/motion';
import { APP_STRINGS } from '@/lib/strings';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { title, description, cta } = APP_STRINGS.PAGES.DASHBOARD;

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[rgba(14,165,233,0.12)] blur-3xl dark:bg-[rgba(56,189,248,0.14)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-[rgba(99,102,241,0.08)] blur-3xl dark:bg-[rgba(99,102,241,0.1)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[rgba(34,197,94,0.07)] blur-3xl dark:bg-[rgba(34,197,94,0.08)]"
      />
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3 }}
        className="text-3xl font-semibold tracking-tight text-accent"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.3 }}
        className="max-w-md text-center text-slate-500 dark:text-slate-400"
      >
        {description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.3 }}
      >
        <Button size="lg" onClick={() => navigate('/build')}>
          {cta}
        </Button>
      </motion.div>
    </motion.div>
  );
}
