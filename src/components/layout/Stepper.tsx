import { Check } from 'lucide-react';
import { motion } from 'motion/react';

import { APP_STRINGS } from '@/lib/strings';
import { cn } from '@/lib/utils';
import useCyberRangeStore from '@/store/cyberRangeStore';

export default function Stepper() {
  const currentStep = useCyberRangeStore((state) => state.currentStep);

  return (
    <ol className="flex items-center" aria-label="Workflow progress">
      {APP_STRINGS.STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <li
            key={step.id}
            data-state={isActive ? 'active' : isComplete ? 'complete' : 'inactive'}
            className="flex items-center"
          >
            {isActive ? (
              <motion.div
                layoutId="active-step"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-accent text-xs font-semibold text-white"
              >
                {stepNumber}
              </motion.div>
            ) : (
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold',
                  isComplete
                    ? 'border-ready bg-ready text-white'
                    : 'border-panel-border bg-panel-bg text-muted-foreground opacity-50',
                )}
              >
                {isComplete ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                ) : (
                  stepNumber
                )}
              </div>
            )}

            <span
              className={cn(
                'ml-2 hidden text-sm md:inline',
                isActive && 'font-medium text-foreground',
                isComplete && 'text-foreground',
                !isActive && !isComplete && 'text-muted-foreground opacity-50',
              )}
            >
              {step.label}
            </span>

            {index < APP_STRINGS.STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn('mx-3 h-0.5 w-8 rounded-full lg:w-12', isComplete ? 'bg-ready' : 'bg-panel-border')}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
