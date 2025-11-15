import type { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showLanguageSwitch?: boolean;
}

const Layout = ({ children, title, showLanguageSwitch = false }: LayoutProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleLanguageChange = () => {
    navigate('/language');
  };

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      <AppBar position="static" elevation={2} sx={{boxShadow: 'none'}}>
        <Toolbar sx={{ position: 'relative' }}>
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
            {title || 'ALUMETAL'}
          </Typography>

          <Box sx={{ marginLeft: 'auto' }}>
            {showLanguageSwitch && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                  {i18n.language}
                </Typography>
                <IconButton color="inherit" onClick={handleLanguageChange}>
                  <LanguageIcon />
                </IconButton>
              </Box>
            )}
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

