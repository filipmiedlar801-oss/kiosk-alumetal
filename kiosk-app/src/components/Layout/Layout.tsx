import type { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import AlumetalLogo from '../AlumetalLogo/AlumetalLogo';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showLanguageSwitch?: boolean;
}

const Layout = ({ children, title, showLanguageSwitch = false }: LayoutProps) => {
  return (
    <Box sx={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      <AppBar position="static" elevation={2} sx={{ boxShadow: 'none', bgcolor: 'secondary.main', border:'none' }}>

        <Toolbar sx={{ position: 'relative' }}>
          <Box sx={{ marginRight: 'auto' }}>
            <AlumetalLogo />
          </Box>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 600
            }}
          >
            {title || <AlumetalLogo />}
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            {showLanguageSwitch && <LanguageSelector />}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

