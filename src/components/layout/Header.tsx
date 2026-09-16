import { Moon, RotateCcw, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { APP_STRINGS } from '@/lib/strings';
import { useTheme } from '@/lib/theme';
import useCyberRangeStore from '@/store/cyberRangeStore';
import Stepper from './Stepper';

export default function Header() {
  const navigate = useNavigate();
  const currentStep = useCyberRangeStore((state) => state.currentStep);
  const reset = useCyberRangeStore((state) => state.reset);
  const activeStep = APP_STRINGS.STEPS[currentStep - 1];
  const { theme, toggle } = useTheme();

  const handleReset = () => {
    if (window.confirm(APP_STRINGS.HEADER.RESET_CONFIRM)) {
      reset();
      navigate('/');
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-panel-border bg-panel-bg px-6 shadow-[0_1px_12px_var(--glass-shadow)] backdrop-blur-[12px]">
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        <span className="font-mono text-sm font-semibold tracking-tight text-accent">{APP_STRINGS.APP_NAME}</span>
        <span className="sr-only">{activeStep?.description}</span>
      </div>

      <Stepper />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Sun className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>{APP_STRINGS.HEADER.RESET_LABEL}</span>
        </Button>
      </div>
    </header>
  );
}
