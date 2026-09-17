import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Brand from './Brand';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../i18n/I18nProvider';

interface HeaderProps {
  actions?: ReactNode;
}

function Header({ actions }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <Box component="header" sx={{ py: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          <Link
            href={import.meta.env.BASE_URL}
            aria-label={t('header.home')}
            underline="none"
            color="inherit"
            sx={{ display: 'inline-flex', borderRadius: 1 }}
          >
            {/* With actions the name is dropped on narrow screens, where it would wrap and grow the header. */}
            <Brand size={32} nameSx={actions ? { display: { xs: 'none', sm: 'inline' } } : undefined} />
          </Link>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {actions}
            <LanguageSelector />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Header;
