import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../../components/Layout/Layout';

interface ErrorState {
  errors?: Array<{ field: string; message: string }>;
  notificationId?: string;
}

const ErrorScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as ErrorState;
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const errors = state?.errors || [
    { field: 'SENT', message: 'Niezgodny numer SENT' },
    { field: 'BDO', message: 'Kod BDO nie pasuje do deklaracji' },
  ];

  const handleGoBack = () => {
    if (state?.notificationId) {
      navigate(`/notification/${state.notificationId}`);
    } else {
      navigate('/search');
    }
  };

  const handleSendEmail = () => {
    // Symulacja wysyłki emaila
    setTimeout(() => {
      setEmailSent(true);
      setTimeout(() => {
        setEmailDialogOpen(false);
        setEmailSent(false);
        setEmail('');
      }, 2000);
    }, 1000);
  };

  const handleFinish = () => {
    navigate('/language');
  };

  return (
    <Layout
      title={t('errors.title')}
      showLanguageSwitch
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'error.light',
              borderRadius: 3,
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 80,
                color: 'error.dark',
                mb: 2,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.dark' }}>
              {t('errors.title')}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'error.dark' }}>
              {t('errors.description')}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              Wykryte niezgodności:
            </Typography>
            <List>
              {errors.map((error, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: 'error.light',
                    borderRadius: 2,
                    mb: 1,
                    border: '2px solid',
                    borderColor: 'error.main',
                  }}
                >
                  <ListItemIcon>
                    <ErrorOutlineIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {error.field}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {error.message}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Alert severity="warning">
            <Typography variant="body1">
              <strong>Uwaga:</strong> Nie możesz kontynuować procesu rejestracji z
              niezgodnościami. Musisz je najpierw rozwiązać.
            </Typography>
          </Alert>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Co możesz zrobić?
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                fullWidth
                sx={{
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {t('errors.actions.goBack')}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<EmailIcon />}
                onClick={() => setEmailDialogOpen(true)}
                fullWidth
                sx={{
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {t('errors.actions.sendEmail')}
              </Button>

              <Button
                variant="outlined"
                color="error"
                size="large"
                startIcon={<CloseIcon />}
                onClick={handleFinish}
                fullWidth
                sx={{
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {t('errors.actions.finish')}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('errors.actions.sendEmail')}</DialogTitle>
        <DialogContent>
          {!emailSent ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Wpisz swój adres email, a my wyślemy zgłoszenie o niezgodnościach do
                działu spedycji.
              </Typography>
              <TextField
                fullWidth
                label="Adres email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.com"
              />
            </>
          ) : (
            <Alert severity="success">
              <Typography variant="body1">{t('errors.emailSent')}</Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          {!emailSent && (
            <>
              <Button onClick={() => setEmailDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSendEmail}
                variant="contained"
                disabled={!email.includes('@')}
              >
                {t('common.confirm')}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ErrorScreen;
