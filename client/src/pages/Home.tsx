import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Countdown from '../countdown/Countdown';
import CountdownForm from '../countdown/CountdownForm';
import ShareDialog from '../countdown/ShareDialog';
import { createDefaultConfig } from '../countdown/config';
import { buildCountdownLink, encodeCountdownToken } from '../countdown/link';
import { shareCountdownLink } from '../countdown/share';

interface SharedLink {
  id: number;
  link: string;
  title: string;
}

const SHARED_MESSAGE_DURATION_MS = 4000;

function Home() {
  const [config, setConfig] = useState(createDefaultConfig);
  const [shared, setShared] = useState<SharedLink | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sharedMessageOpen, setSharedMessageOpen] = useState(false);

  async function handleShare() {
    const link = buildCountdownLink(encodeCountdownToken(config));
    const title = config.title.trim();
    const result = await shareCountdownLink(link, title);

    if (result === 'shared') {
      setSharedMessageOpen(true);
    } else if (result === 'unsupported' || result === 'failed') {
      setShared((previous) => ({ id: (previous?.id ?? 0) + 1, link, title }));
      setDialogOpen(true);
    }
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
        <Box component="section" aria-labelledby="form-title">
          <Typography variant="h1" id="form-title" sx={{ mb: 1.5 }}>
            Create your countdown
          </Typography>
          <CountdownForm config={config} onChange={setConfig} onShare={handleShare} />
        </Box>
        <Box
          component="section"
          aria-labelledby="preview-title"
          sx={{ order: { xs: -1, md: 0 }, position: { md: 'sticky' }, top: { md: 24 } }}
        >
          <Typography variant="h2" id="preview-title" sx={{ mb: 1.5 }}>
            Preview
          </Typography>
          <Countdown config={config} />
        </Box>
      </Container>
      <Footer />
      {shared && (
        <ShareDialog
          key={shared.id}
          open={dialogOpen}
          link={shared.link}
          title={shared.title}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <Snackbar
        open={sharedMessageOpen}
        autoHideDuration={SHARED_MESSAGE_DURATION_MS}
        onClose={() => setSharedMessageOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSharedMessageOpen(false)}>
          Countdown shared
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;
