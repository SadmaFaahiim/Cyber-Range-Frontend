import { AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

import ComponentPalette from '@/components/infrastructure/ComponentPalette';
import InfrastructureCanvas from '@/components/infrastructure/InfrastructureCanvas';
import PropertiesPanel from '@/components/infrastructure/PropertiesPanel';
import { Button } from '@/components/ui/button';
import { APP_STRINGS } from '@/lib/strings';
import { validateInfrastructureCanvas } from '@/lib/validation';
import useCyberRangeStore from '@/store/cyberRangeStore';

export default function InfrastructureBuilderPage() {
  const navigate = useNavigate();
  const canvasNodes = useCyberRangeStore((state) => state.canvasNodes);
  const canvasEdges = useCyberRangeStore((state) => state.canvasEdges);
  const setStep = useCyberRangeStore((state) => state.setStep);
  const valid = validateInfrastructureCanvas(canvasNodes, canvasEdges);

  const handleContinue = () => {
    if (!valid) {
      return;
    }
    setStep(2);
    navigate('/review');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <div className="flex min-h-0 flex-1">
        <ComponentPalette />
        <InfrastructureCanvas />
        <PropertiesPanel />
      </div>

      <footer className="flex h-14 shrink-0 items-center justify-between gap-4 border-t border-panel-border bg-panel-bg px-6">
        {valid ? (
          <p className="text-sm text-ready">{APP_STRINGS.BUILDER.READY_TEXT}</p>
        ) : (
          <p className="flex items-center gap-2 text-sm text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {APP_STRINGS.BUILDER.NO_NODES}
          </p>
        )}
        <Button data-testid="continue-button" onClick={handleContinue} disabled={!valid}>
          {APP_STRINGS.PAGES.BUILD.ctaPrimary}
        </Button>
      </footer>
    </motion.div>
  );
}
