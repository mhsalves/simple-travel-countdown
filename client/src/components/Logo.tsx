interface LogoProps {
  size?: number;
}

function Logo({ size = 32 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="15" fill="var(--color-primary)" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="var(--color-primary-text)" strokeWidth="2" />
      <path d="M16 10v6l4 3" fill="none" stroke="var(--color-primary-text)" strokeWidth="2" strokeLinecap="round" />
      <path d="M22.5 4.5l5 5-3 1-3-3z" fill="var(--color-primary-text)" />
    </svg>
  );
}

export default Logo;
