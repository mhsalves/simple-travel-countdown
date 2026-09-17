import { useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useTranslation } from '../i18n/I18nProvider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Countdown from '../countdown/Countdown';
import CountdownForm from '../countdown/CountdownForm';
import ShareDialog from '../countdown/ShareDialog';
import { CountdownConfig, createDefaultConfig } from '../countdown/config';
import { buildCountdownLink, decodeCountdownToken, encodeCountdownToken } from '../countdown/link';
import { hasErrors, validateCountdownConfig } from '../countdown/validation';

// An `?edit=<token>` link (from the countdown page) opens the form with that countdown loaded.
const EDIT_PARAM = 'edit';

function readEditedConfig(): CountdownConfig | null {
  const token = new URLSearchParams(window.location.search).get(EDIT_PARAM);
  return token ? decodeCountdownToken(token) : null;
}

interface ShareSession {
  id: number;
  link: string;
  config: CountdownConfig;
  generatedAt: Date;
}

function Home() {
  const { t } = useTranslation();
  const editedConfig = useMemo(readEditedConfig, []);
  const [config, setConfig] = useState(() => editedConfig ?? createDefaultConfig());
  const [showErrors, setShowErrors] = useState(false);
  const [session, setSession] = useState<ShareSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const formSectionRef = useRef<HTMLElement>(null);

  function focusFirstInvalidField() {
    // Runs after React commits the error state, so aria-invalid is up to date.
    window.requestAnimationFrame(() => {
      const section = formSectionRef.current;
      const invalid = section?.querySelector<HTMLElement>('input[aria-invalid="true"], [aria-invalid="true"]');
      (invalid ?? section)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalid?.focus({ preventScroll: true });
    });
  }

  function handleShare() {
    setShowErrors(true);
    if (hasErrors(validateCountdownConfig(config))) {
      focusFirstInvalidField();
      return;
    }

    setSession((previous) => ({
      id: (previous?.id ?? 0) + 1,
      link: buildCountdownLink(encodeCountdownToken(config)),
      config,
      generatedAt: new Date(),
    }));
    setDialogOpen(true);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container
        component="main"
        sx={{
          display: 'grid',
          gap: 3,
          pt: 4,
          pb: 6,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(0, 3fr)' },
          alignItems: 'start',
        }}
      >
        <Box component="section" aria-labelledby="form-title" ref={formSectionRef}>
          <Typography variant="h1" id="form-title" sx={{ mb: 1.5 }}>
            {editedConfig ? t('home.edit') : t('home.create')}
          </Typography>
          <CountdownForm config={config} onChange={setConfig} showErrors={showErrors} onShare={handleShare} />
        </Box>
        <Box
          component="section"
          aria-labelledby="preview-title"
          sx={{ order: { xs: -1, md: 0 }, position: { md: 'sticky' }, top: { md: 24 } }}
        >
          <Typography variant="h2" id="preview-title" sx={{ mb: 1.5 }}>
            {t('home.preview')}
          </Typography>
          <Countdown config={config} />
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<ShareRoundedIcon />}
            onClick={handleShare}
            sx={{ mt: 2 }}
          >
            {t('action.share')}
          </Button>
        </Box>
      </Container>
      <Footer />
      {session && (
        <ShareDialog
          key={session.id}
          open={dialogOpen}
          link={session.link}
          config={session.config}
          generatedAt={session.generatedAt}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Box>
  );
}

export default Home;
