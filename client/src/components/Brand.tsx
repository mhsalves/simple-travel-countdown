import Logo from './Logo';

const APP_NAME = 'Travel Countdown';

interface BrandProps {
  size?: number;
}

function Brand({ size }: BrandProps) {
  return (
    <span className="brand">
      <Logo size={size} />
      <span className="brand__name">{APP_NAME}</span>
    </span>
  );
}

export default Brand;
