import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from '../i18n/I18nProvider';
import { CountdownConfig, getBackgroundStyle } from './config';
import { getCountdownDisplay } from './display';
import { useNow } from './timeLeft';

interface CountdownProps {
  config: CountdownConfig;
  variant?: 'preview' | 'page';
}

function Countdown({ config, variant = 'preview' }: CountdownProps) {
  const now = useNow();
  const { t } = useTranslation();
  const { title, units, status } = getCountdownDisplay(config, now, t);
  const isPage = variant === 'page';

  return (
    <Stack
      spacing={isPage ? 5 : 3}
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: isPage ? 1 : undefined,
        width: isPage ? '100%' : undefined,
        minHeight: isPage ? undefined : 360,
        px: 2,
        py: isPage ? 8 : 5,
        borderRadius: isPage ? 0 : '12px',
        textAlign: 'center',
      }}
      style={getBackgroundStyle(config.background)}
    >
      <Typography
        variant="h2"
        component="p"
        sx={{
          fontSize: isPage ? 'clamp(2rem, 6vw, 3.5rem)' : 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          overflowWrap: 'anywhere',
        }}
        style={{ color: config.titleColor }}
      >
        {title}
      </Typography>

      <Stack
        direction="row"
        role="timer"
        sx={{ gap: isPage ? 'clamp(20px, 6vw, 56px)' : 'clamp(12px, 4vw, 32px)' }}
        style={{ color: config.counterColor }}
      >
        {units.map(({ label, value }) => (
          <Stack key={label} sx={{ alignItems: 'center' }}>
            <Typography
              variant="countdownValue"
              sx={isPage ? { fontSize: 'clamp(3rem, 12vw, 6rem)' } : undefined}
            >
              {value}
            </Typography>
            <Typography variant="overline" sx={{ opacity: 0.85 }}>
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {status && (
        <Box component="p" sx={{ m: 0, fontWeight: 600 }} style={{ color: config.counterColor }}>
          {status}
        </Box>
      )}
    </Stack>
  );
}

export default Countdown;
