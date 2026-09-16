import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardRoot } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { APP_STRINGS } from '@/lib/strings';
import { validateReadiness } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';

export default function ReviewPage() {
  const navigate = useNavigate();
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const setStep = useCyberRangeStore((state) => state.setStep);

  const report = validateReadiness(canvasNodes, canvasEdges);
  const { title, description, ctaPrimary, nodesLabel, edgesLabel, status } = APP_STRINGS.PAGES.REVIEW;

  const handleContinue = () => {
    if (!report.overall) {
      return;
    }
    setStep(3);
    navigate('/ready');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col items-center justify-center gap-6 p-6"
    >
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="max-w-md text-center text-muted-foreground">{description}</p>

      <CardRoot className="w-full max-w-md">
        <CardContent className="flex items-center justify-around p-6">
          <div className="flex flex-col items-center gap-1">
            <span data-testid="node-count" className="text-2xl font-semibold text-slate-700">
              {canvasNodes.length}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-500">{nodesLabel}</span>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="flex flex-col items-center gap-1">
            <span data-testid="edge-count" className="text-2xl font-semibold text-slate-700">
              {canvasEdges.length}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-500">{edgesLabel}</span>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <Badge variant={report.overall ? 'success' : 'warning'}>
            {report.overall ? status.ready : status.incomplete}
          </Badge>
        </CardContent>
      </CardRoot>

      <Button data-testid="review-continue" onClick={handleContinue} disabled={!report.overall}>
        {ctaPrimary}
      </Button>
    </motion.div>
  );
}
