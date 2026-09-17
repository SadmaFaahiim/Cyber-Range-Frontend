interface WindowsLogoProps {
  size?: number;
  className?: string;
}

export default function WindowsLogo({ size = 18, className }: WindowsLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" role="img">
      <rect x="2" y="3" width="8.5" height="8.5" fill="currentColor" />
      <rect x="13" y="3" width="9" height="8.5" fill="currentColor" />
      <rect x="2" y="12.5" width="8.5" height="8.5" fill="currentColor" />
      <rect x="13" y="12.5" width="9" height="8.5" fill="currentColor" />
    </svg>
  );
}
