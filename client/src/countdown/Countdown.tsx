import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CountdownConfig, getBackgroundStyle } from './config';
import { getTimeLeft, useNow } from './timeLeft';

const TITLE_PLACEHOLDER = 'Your trip title';

interface CountdownProps {
  config: CountdownConfig;
}

function Countdown({ config }: CountdownProps) {
  const now = useNow();
  const target = config.finishDate?.isValid() ? config.finishDate.toDate() : null;
  const timeLeft = getTimeLeft(target ?? new Date(now), now);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  let status = '';
  if (!target) {
    status = 'Choose a finish date';
  } else if (timeLeft.finished) {
    status = 'The countdown has finished';
  }

  return (
    <Stack
      spacing={3}
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 360,
        px: 2,
        py: 5,
        borderRadius: '12px',
        textAlign: 'center',
      }}
      style={getBackgroundStyle(config.background)}
    >
      <Typography
        variant="h2"
        component="p"
        sx={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, overflowWrap: 'anywhere' }}
        style={{ color: config.titleColor }}
      >
        {config.title.trim() || TITLE_PLACEHOLDER}
      </Typography>

      <Stack direction="row" role="timer" sx={{ gap: 'clamp(12px, 4vw, 32px)' }} style={{ color: config.counterColor }}>
        {units.map(({ label, value }) => (
          <Stack key={label} sx={{ alignItems: 'center' }}>
            <Typography variant="countdownValue">{String(value).padStart(2, '0')}</Typography>
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
