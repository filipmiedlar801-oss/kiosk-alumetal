import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Fade,
} from '@mui/material';
import safetyPl from '../../assets/safety-rules/safety-pl.jpg';
import safetyEn from '../../assets/safety-rules/safety-en.png';
import safetyDe from '../../assets/safety-rules/safety-de.png';
import safetyUa from '../../assets/safety-rules/safety-ua.png';

const safetyImages: Record<string, string> = {
  pl: safetyPl,
  en: safetyEn,
  de: safetyDe,
  ua: safetyUa,
};

const SafetyRulesScreen = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  const lang = i18n.language?.split('-')[0] || 'pl';
  const imageSrc = safetyImages[lang] || safetyImages.pl;

  const handleConfirm = () => {
    if (!accepted) return;
    navigate('/notifications');
  };

  const handleBack = () => {
    navigate('/language');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 1.5,
        pb: 2,
        px: 1,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          width: '100%',
          flex: '1 1 0%',
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'transparent',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            bgcolor: 'transparent',
          }}
        >
          <Fade in timeout={500}>
            <Box
              component="img"
              src={imageSrc}
              alt="Safety rules"
              sx={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          </Fade>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, width: '100%' }}>
        <Container maxWidth="md" sx={{ width: '100%', py: 0, mt: 2 }}>
        <Fade in timeout={500}>
          <Paper
            elevation={8}
            sx={{
              p: 1.5,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              border: 'none',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('safetyRules.acceptText')}
                </Typography>
              }
              sx={{ mx: 0 }}
            />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={!accepted}
                sx={{ flex: { sm: 1 }, maxWidth: { sm: 240 } }}
              >
                {t('safetyRules.confirm')}
              </Button>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ flex: { sm: 1 }, maxWidth: { sm: 240 } }}
              >
                {t('safetyRules.back')}
              </Button>
            </Stack>
          </Paper>
        </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default SafetyRulesScreen;
