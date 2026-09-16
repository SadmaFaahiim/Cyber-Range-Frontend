import { Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import ExerciseSummary from '@/components/ready/ExerciseSummary';
import { Button } from '@/components/ui/button';
import { pageTransition } from '@/lib/motion';
import { APP_STRINGS } from '@/lib/strings';
import { validateReadiness } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';

export default function ReadinessPage() {
  const [launched, setLaunched] = useState(false);
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);

  const report = validateReadiness(canvasNodes, canvasEdges);

  if (launched) {
    return (
      <motion.div
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
        className="h-full w-full"
      >
        <ExerciseSummary />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="flex h-full flex-col items-center justify-center gap-6 p-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.25 }}
        className="text-3xl font-semibold tracking-tight text-foreground"
      >
        {APP_STRINGS.PAGES.READY.title}
      </motion.h1>

      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.25 }}
        className="flex w-80 flex-col gap-2 rounded-lg border border-panel-border bg-panel-bg p-3 shadow-[0_8px_32px_var(--glass-shadow)] backdrop-blur-[16px]"
        data-testid="readiness-checklist"
      >
        {APP_STRINGS.READINESS.CHECKLIST.map((item, index) => {
          const passed = report.checks[item.key];
          return (
            <motion.li
              key={item.key}
              data-state={passed ? 'pass' : 'fail'}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + index * 0.08, duration: 0.25 }}
              className="flex items-center gap-3 rounded-md border border-panel-border bg-white/70 px-4 py-2.5 dark:bg-[rgba(23,28,42,0.72)]"
            >
              {passed ? (
                <Check className="h-4 w-4 shrink-0 text-ready" aria-hidden="true" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              )}
              <span className="text-sm text-slate-700 dark:text-slate-200">{item.label}</span>
            </motion.li>
          );
        })}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.25 }}
      >
        <Button
          data-testid="launch-button"
          onClick={() => setLaunched(true)}
          disabled={!report.overall}
          className={report.overall ? 'shadow-[0_0_20px_rgba(14,165,233,0.4)]' : undefined}
        >
          {APP_STRINGS.READINESS.LAUNCH_LABEL}
        </Button>
      </motion.div>
    </motion.div>
  );
}
