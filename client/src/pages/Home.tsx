import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Countdown from '../countdown/Countdown';
import CountdownForm from '../countdown/CountdownForm';
import LinkDialog from '../countdown/LinkDialog';
import { createDefaultConfig } from '../countdown/config';
import { buildCountdownLink, encodeCountdownToken } from '../countdown/link';

interface GeneratedLink {
  id: number;
  link: string;
  title: string;
}

function Home() {
  const [config, setConfig] = useState(createDefaultConfig);
  const [generated, setGenerated] = useState<GeneratedLink | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleGenerate() {
    setGenerated((previous) => ({
      id: (previous?.id ?? 0) + 1,
      link: buildCountdownLink(encodeCountdownToken(config)),
      title: config.title.trim(),
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
        <Box component="section" aria-labelledby="form-title">
          <Typography variant="h1" id="form-title" sx={{ mb: 1.5 }}>
            Create your countdown
          </Typography>
          <CountdownForm config={config} onChange={setConfig} onGenerate={handleGenerate} />
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
      {generated && (
        <LinkDialog
          key={generated.id}
          open={dialogOpen}
          link={generated.link}
          title={generated.title}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Box>
  );
}

export default Home;
