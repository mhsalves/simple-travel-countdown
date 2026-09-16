import Stack from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Logo from './Logo';

const APP_NAME = 'Travel Countdown';

interface BrandProps {
  size: number;
  nameSx?: TypographyProps['sx'];
}

function Brand({ size, nameSx }: BrandProps) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: `${Math.round(size / 3)}px` }}>
      <Logo size={size} />
      <Typography variant="subtitle1" component="span" sx={nameSx}>
        {APP_NAME}
      </Typography>
    </Stack>
  );
}

export default Brand;
