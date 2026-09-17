import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Brand from './Brand';
import { useTranslation } from '../i18n/I18nProvider';

function Footer() {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={{ mt: 'auto', py: 2.5, borderTop: 1, borderColor: 'divider', color: 'text.secondary' }}>
      <Container>
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px 16px' }}
        >
          <Brand size={24} nameSx={{ fontSize: '0.875rem' }} />
          <Typography variant="body2">
            {t('footer.developedBy')}{' '}
            <Link href="https://matheusalves.dev/" target="_blank" rel="noopener noreferrer">
              Matheus Alves
            </Link>{' '}
            · {new Date().getFullYear()}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
