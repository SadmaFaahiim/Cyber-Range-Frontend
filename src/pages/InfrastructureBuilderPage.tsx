import { AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import ComponentPalette from '@/components/infrastructure/ComponentPalette';
import InfrastructureCanvas from '@/components/infrastructure/InfrastructureCanvas';
import PropertiesPanel from '@/components/infrastructure/PropertiesPanel';
import { Button } from '@/components/ui/button';
import { pageTransition } from '@/lib/motion';
import { APP_STRINGS } from '@/lib/strings';
import { allPcsHaveOs, validateInfrastructureCanvas } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';

export default function InfrastructureBuilderPage() {
  const navigate = useNavigate();
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const setStep = useCyberRangeStore((state) => state.setStep);
  const pendingCable = useCyberRangeStore((state) => state.pendingCable);
  const cancelPendingCable = useCyberRangeStore((state) => state.cancelPendingCable);
  const valid = validateInfrastructureCanvas(canvasNodes, canvasEdges);
  const missingOs = !allPcsHaveOs(canvasNodes);

  const handleContinue = () => {
    if (!valid) {
      return;
    }
    setStep(2);
    navigate('/review');
  };

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="flex h-full w-full flex-col"
    >
      <div className="flex min-h-0 flex-1">
        <ComponentPalette />
        <InfrastructureCanvas />
        <PropertiesPanel />
      </div>

      <footer className="flex h-14 shrink-0 items-center justify-between gap-4 border-t border-panel-border bg-panel-bg px-6 shadow-[0_-2px_12px_var(--glass-shadow)] backdrop-blur-[8px]">
        <div className="min-w-0 flex-1">
          {pendingCable ? (
            <p className="truncate text-sm font-medium text-accent">{APP_STRINGS.BUILDER.CABLE_IN_PROGRESS}</p>
          ) : valid ? (
            <p className="text-sm text-ready">{APP_STRINGS.BUILDER.READY_TEXT}</p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-warning">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {missingOs ? APP_STRINGS.BUILDER.MISSING_OS : APP_STRINGS.BUILDER.NO_NODES}
            </p>
          )}
        </div>

        {pendingCable ? (
          <Button variant="outline" size="sm" onClick={cancelPendingCable}>
            {APP_STRINGS.BUILDER.CABLE_CANCEL}
          </Button>
        ) : (
          <Button data-testid="continue-button" onClick={handleContinue} disabled={!valid}>
            {APP_STRINGS.PAGES.BUILD.ctaPrimary}
          </Button>
        )}
      </footer>
    </motion.div>
  );
}
