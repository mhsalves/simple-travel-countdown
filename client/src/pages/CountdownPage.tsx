import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
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

// Opens the home form with this countdown loaded.
function EditCountdownButton({ token }: { token: string }) {
  const { t } = useTranslation();
  return (
    <Button
      component="a"
      href={`${import.meta.env.BASE_URL}?edit=${token}`}
      variant="text"
      sx={{ flexShrink: 0, px: 1.5, whiteSpace: 'nowrap' }}
    >
      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{t('action.edit')}</Box>
      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{t('action.editCountdown')}</Box>
    </Button>
  );
}

function CountdownPage({ token }: CountdownPageProps) {
  const { t } = useTranslation();
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
            <EditCountdownButton token={token} />
            <Button variant="contained" startIcon={<ShareRoundedIcon />} onClick={handleShare} sx={{ flexShrink: 0 }}>
              {t('action.share')}
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
