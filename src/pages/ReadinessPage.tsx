import { Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { APP_STRINGS } from '@/lib/strings';
import { validateReadiness } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';

export default function ReadinessPage() {
  const navigate = useNavigate();
  const [launched, setLaunched] = useState(false);
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);

  const report = validateReadiness(canvasNodes, canvasEdges);

  if (launched) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col items-center justify-center gap-4 p-6"
      >
        <Check className="h-10 w-10 text-ready" aria-hidden="true" />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {APP_STRINGS.READINESS.LAUNCHED_TITLE}
        </h1>
        <p className="max-w-md text-center text-muted-foreground">{APP_STRINGS.READINESS.LAUNCHED_DESC}</p>
        <Button className="mt-2" onClick={() => navigate('/')}>
          {APP_STRINGS.PAGES.READY.ctaPrimary}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col items-center justify-center gap-6 p-6"
    >
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{APP_STRINGS.PAGES.READY.title}</h1>

      <ul className="flex flex-col gap-2" data-testid="readiness-checklist">
        {APP_STRINGS.READINESS.CHECKLIST.map((item) => {
          const passed = report.checks[item.key];
          return (
            <li
              key={item.key}
              data-state={passed ? 'pass' : 'fail'}
              className="flex w-80 items-center gap-3 rounded-md border border-panel-border bg-panel-bg px-4 py-2.5"
            >
              {passed ? (
                <Check className="h-4 w-4 shrink-0 text-ready" aria-hidden="true" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              )}
              <span className="text-sm text-foreground">{item.label}</span>
            </li>
          );
        })}
      </ul>

      <Button data-testid="launch-button" onClick={() => setLaunched(true)} disabled={!report.overall}>
        {APP_STRINGS.READINESS.LAUNCH_LABEL}
      </Button>
    </motion.div>
  );
}
