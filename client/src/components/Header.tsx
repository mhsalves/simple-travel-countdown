import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Brand from './Brand';

function Header() {
  return (
    <Box component="header" sx={{ py: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container>
        <Brand size={32} />
      </Container>
    </Box>
  );
}

export default Header;
