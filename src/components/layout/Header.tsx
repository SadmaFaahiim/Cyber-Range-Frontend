import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { APP_STRINGS } from '@/lib/strings';
import useCyberRangeStore from '@/store/cyberRangeStore';
import Stepper from './Stepper';

export default function Header() {
  const navigate = useNavigate();
  const currentStep = useCyberRangeStore((state) => state.currentStep);
  const reset = useCyberRangeStore((state) => state.reset);
  const activeStep = APP_STRINGS.STEPS[currentStep - 1];

  const handleReset = () => {
    if (window.confirm(APP_STRINGS.HEADER.RESET_CONFIRM)) {
      reset();
      navigate('/');
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-panel-border bg-panel-bg px-6">
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        <span className="font-mono text-sm font-semibold tracking-tight text-foreground">{APP_STRINGS.APP_NAME}</span>
        <span className="sr-only">{activeStep?.description}</span>
      </div>

      <Stepper />

      <Button variant="ghost" size="sm" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        <span>{APP_STRINGS.HEADER.RESET_LABEL}</span>
      </Button>
    </header>
  );
}
