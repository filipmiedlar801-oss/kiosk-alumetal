import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Fade,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const LanguageScreen = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLang(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    
    setTimeout(() => {
      navigate('/notifications');
    }, 300);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Paper
            elevation={8}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <LanguageIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                ALUMETAL
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                Kiosk Rejestracji Kierowców
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                mb: 5,
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              Wybierz język / Select language
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLang === lang.code ? 'contained' : 'outlined'}
                  size="large"
                  onClick={() => handleLanguageSelect(lang.code)}
                  sx={{
                    py: 4,
                    px: 4,
                    fontSize: '1.5rem',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: selectedLang === lang.code ? 'primary.main' : 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '3rem' }}>{lang.flag}</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                      {lang.name}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 4 }}
            >
              Dotknij wybranego języka / Touch your preferred language
            </Typography>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LanguageScreen;
