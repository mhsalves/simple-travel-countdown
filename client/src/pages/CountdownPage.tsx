import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '../i18n/I18nProvider';
import Header from '../components/Header';
import Countdown from '../countdown/Countdown';
import ShareDialog from '../countdown/ShareDialog';
import { decodeCountdownToken } from '../countdown/link';

interface CountdownPageProps {
  token: string;
}

function CreateCountdownButton() {
  const { t } = useTranslation();
  return (
    <Button component="a" href={import.meta.env.BASE_URL} variant="contained" size="large">
      {t('action.create')}
    </Button>
  );
}

// Opens the home form with this countdown loaded. Below `sm` the actions are
// icon-only, so the header keeps the language selector on one line.
function EditCountdownButton({ token, compact }: { token: string; compact: boolean }) {
  const { t } = useTranslation();
  return (
    <Button
      component="a"
      href={`${import.meta.env.BASE_URL}?edit=${token}`}
      variant="text"
      sx={{ flexShrink: 0, px: compact ? 1 : 1.5, minWidth: 0, whiteSpace: 'nowrap' }}
    >
      {compact ? t('action.edit') : t('action.editCountdown')}
    </Button>
  );
}

function CountdownPage({ token }: CountdownPageProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('sm'));
  const config = useMemo(() => decodeCountdownToken(token), [token]);
  const [share, setShare] = useState<{ id: number; generatedAt: Date } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleShare() {
    setShare((previous) => ({ id: (previous?.id ?? 0) + 1, generatedAt: new Date() }));
    setDialogOpen(true);
  }

  if (!config) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 2,
            px: 3,
          }}
        >
          <Typography variant="h1" sx={{ fontSize: '1.5rem' }}>
            {t('page.invalidTitle')}
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
            {t('page.invalidText')}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <CreateCountdownButton />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        actions={
          <>
            <EditCountdownButton token={token} compact={compact} />
            <Button
              variant="contained"
              onClick={handleShare}
              aria-label={compact ? t('action.share') : undefined}
              startIcon={compact ? undefined : <ShareRoundedIcon />}
              sx={{ flexShrink: 0, minWidth: 0, px: compact ? 1.25 : 2 }}
            >
              {compact ? <ShareRoundedIcon /> : t('action.share')}
            </Button>
          </>
        }
      />
      <Box component="main" sx={{ flex: 1, display: 'flex' }}>
        <Countdown config={config} variant="page" />
      </Box>
      {share && (
        <ShareDialog
          key={share.id}
          open={dialogOpen}
          link={window.location.href}
          config={config}
          generatedAt={share.generatedAt}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Box>
  );
}

export default CountdownPage;
