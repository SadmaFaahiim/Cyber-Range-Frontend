interface LinuxLogoProps {
  size?: number;
  className?: string;
}

export default function LinuxLogo({ size = 18, className }: LinuxLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" role="img">
      <title>Linux</title>
      <ellipse cx="12" cy="9" rx="5" ry="5.5" fill="currentColor" />
      <path d="M6.5 13c-1.3 1.8-2 3.2-2 5 0 2.5 3.5 4 7.5 4s7.5-1.5 7.5-4c0-1.8-.7-3.2-2-5" fill="currentColor" />
      <circle cx="9.5" cy="8" r="1.3" fill="white" />
      <circle cx="14.5" cy="8" r="1.3" fill="white" />
      <circle cx="9.5" cy="8.4" r="0.55" fill="black" />
      <circle cx="14.5" cy="8.4" r="0.55" fill="black" />
      <path d="M10.6 11.2h2.8l-1.4 1.6z" fill="#f59e0b" />
      <ellipse cx="12" cy="18.5" rx="3.4" ry="2" fill="white" />
    </svg>
  );
}
