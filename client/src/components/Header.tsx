import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Brand from './Brand';

interface HeaderProps {
  actions?: ReactNode;
}

function Header({ actions }: HeaderProps) {
  return (
    <Box component="header" sx={{ py: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          {/* With actions the name is dropped on narrow screens, where it would wrap and grow the header. */}
          <Brand size={32} nameSx={actions ? { display: { xs: 'none', sm: 'inline' } } : undefined} />
          {actions && (
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexShrink: 0 }}>
              {actions}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default Header;
