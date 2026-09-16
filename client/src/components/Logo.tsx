interface LogoProps {
  size?: number;
}

// Mirrors client/public/favicon.svg; keep both in sync.
function Logo({ size = 32 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="12" fill="#0B6E99" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="3.5" />
      <path d="M24 10A14 14 0 1 1 10 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M24 24V16.5M24 24l5 2.9" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <path
        transform="translate(14.1 14.1) rotate(-45) scale(0.8)"
        fill="#F7C35F"
        d="M-8.5-3h1l1.5 1.8h2.4L-5-6.5h2l3.5 5.3h5q2 0 2 1.2t-2 1.2h-5L-3 6.5h-2l1.4-5.3H-6L-7.5 3h-1l.9-3z"
      />
    </svg>
  );
}

export default Logo;
