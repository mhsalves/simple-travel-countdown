import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import Header from '../components/Header';
import Countdown from '../countdown/Countdown';
import ShareDialog from '../countdown/ShareDialog';
import { decodeCountdownToken } from '../countdown/link';

interface CountdownPageProps {
  token: string;
}

function CreateCountdownButton({ variant = 'contained' }: { variant?: 'contained' | 'text' }) {
  const inHeader = variant === 'text';
  return (
    <Button
      component="a"
      href={import.meta.env.BASE_URL}
      variant={variant}
      size={inHeader ? 'medium' : 'large'}
      sx={inHeader ? { flexShrink: 0, px: 1.5 } : undefined}
    >
      Create
      <Box component="span" sx={inHeader ? { display: { xs: 'none', sm: 'inline' }, pl: 0.5 } : { pl: 0.5 }}>
        my countdown
      </Box>
    </Button>
  );
}

function CountdownPage({ token }: CountdownPageProps) {
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
            Invalid countdown link
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
            This link is broken or has expired. Create a new countdown to get a working link.
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
            <CreateCountdownButton variant="text" />
            <Button variant="contained" startIcon={<ShareRoundedIcon />} onClick={handleShare} sx={{ flexShrink: 0 }}>
              Share
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
