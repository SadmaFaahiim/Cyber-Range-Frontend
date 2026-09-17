import { Router } from 'lucide-react';

interface RouterLogoProps {
  iconSize?: number;
  className?: string;
}

export default function RouterLogo({ iconSize = 16, className }: RouterLogoProps) {
  const badgeSize = iconSize + 12;

  return (
    <span
      className={className ?? 'flex items-center justify-center rounded-full border border-accent/40 bg-accent/10'}
      style={{ width: badgeSize, height: badgeSize }}
    >
      <Router className="text-accent" size={iconSize} aria-hidden="true" />
    </span>
  );
}
