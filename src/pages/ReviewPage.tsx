import { Cable, CheckCircle2, Cpu, TriangleAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pageTransition } from '@/lib/motion';
import { APP_STRINGS } from '@/lib/strings';
import { validateReadiness } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const setStep = useCyberRangeStore((state) => state.setStep);

  const report = validateReadiness(canvasNodes, canvasEdges);
  const { title, description, ctaPrimary, nodesLabel, edgesLabel, status } = APP_STRINGS.PAGES.REVIEW;

  const nodeCount = useCountUp(canvasNodes.length);
  const edgeCount = useCountUp(canvasEdges.length);

  const handleContinue = () => {
    if (!report.overall) {
      return;
    }
    setStep(3);
    navigate('/ready');
  };

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="flex h-full flex-col items-center justify-center gap-7 overflow-y-auto p-6"
    >
      <div className="flex flex-col items-center gap-2">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.25 }}
          className="text-3xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.25 }}
          className="max-w-md text-center text-muted-foreground"
        >
          {description}
        </motion.p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-panel-border bg-panel-bg p-5 shadow-[0_4px_20px_var(--glass-shadow)] backdrop-blur-[10px] transition-transform hover:scale-[1.03]"
        >
          <Cpu className="text-accent" size={20} aria-hidden="true" />
          <span data-testid="node-count" className="text-3xl font-semibold text-foreground">
            {nodeCount}
          </span>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{nodesLabel}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.3 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-panel-border bg-panel-bg p-5 shadow-[0_4px_20px_var(--glass-shadow)] backdrop-blur-[10px] transition-transform hover:scale-[1.03]"
        >
          <Cable className="text-accent" size={20} aria-hidden="true" />
          <span data-testid="edge-count" className="text-3xl font-semibold text-foreground">
            {edgeCount}
          </span>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{edgesLabel}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-panel-border bg-panel-bg p-5 shadow-[0_4px_20px_var(--glass-shadow)] backdrop-blur-[10px] transition-transform hover:scale-[1.03]"
        >
          {report.overall ? (
            <CheckCircle2 className="text-ready" size={20} aria-hidden="true" />
          ) : (
            <TriangleAlert className="text-warning" size={20} aria-hidden="true" />
          )}
          <Badge variant={report.overall ? 'success' : 'warning'}>
            {report.overall ? status.ready : status.incomplete}
          </Badge>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Status</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Button data-testid="review-continue" size="lg" onClick={handleContinue} disabled={!report.overall}>
          {ctaPrimary}
        </Button>
      </motion.div>
    </motion.div>
  );
}
