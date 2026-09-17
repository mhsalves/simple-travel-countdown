import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Header from '../components/Header';
import Countdown from '../countdown/Countdown';
import { decodeCountdownToken } from '../countdown/link';

interface CountdownPageProps {
  token: string;
}

function CreateCountdownButton() {
  return (
    <Button component="a" href={import.meta.env.BASE_URL} variant="contained" size="large">
      Create my countdown
    </Button>
  );
}

function CountdownPage({ token }: CountdownPageProps) {
  const config = useMemo(() => decodeCountdownToken(token), [token]);

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
      <Header />
      <Box component="main" sx={{ flex: 1, display: 'flex' }}>
        <Countdown config={config} variant="page" />
      </Box>
      <Box
        component="footer"
        sx={{ py: 2.5, textAlign: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <CreateCountdownButton />
      </Box>
    </Box>
  );
}

export default CountdownPage;
