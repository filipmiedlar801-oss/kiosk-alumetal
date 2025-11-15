import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Layout from '../../components/Layout/Layout';
import { useNotifications } from '../../context/NotificationContext';
import { useNotificationsById } from '../../api/hooks';

const SummaryScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { notificationIds, clearAll } = useNotifications();
  const [submitting, setSubmitting] = useState(false);

  const [driverData, setDriverData] = useState<any>(() => {
    const savedDriverData = localStorage.getItem('alumetal-driver-data');
    if (savedDriverData) {
      try {
        const parsed = JSON.parse(savedDriverData);
        return {
          success: true,
          items: [{
            driverName: parsed.driverName,
            personalIdNo: parsed.personalIdNo,
            truckPlateNo: parsed.truckPlateNo,
            trailerPlateNo: parsed.trailerPlateNo,
          }],
        };
      } catch (e) {
        console.error('Error parsing driver data from localStorage:', e);
      }
    }
    return null;
  });

  const { data, isLoading } = useNotificationsById(notificationIds);


  const handleFinish = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      clearAll();
      localStorage.removeItem('alumetal-driver-data');
      navigate('/language');
    }, 2000);
  };



  return (
    <Layout
      title={t('summary.title')}
      showLanguageSwitch
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          {driverData?.items && driverData.items.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                {t('summary.driverData')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('notificationDetails.firstName')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {driverData.items[0].driverName?.split(' ')[0] || '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('notificationDetails.lastName')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {driverData.items[0].driverName?.split(' ')[1] || '-'}
                    </Typography>
                  </Box>
                  {driverData.items[0].personalIdNo && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('notificationDetails.personalIdNo')}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {driverData.items[0].personalIdNo}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('notificationDetails.registration')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {driverData.items[0].truckPlateNo || '-'}
                    </Typography>
                  </Box>
                  {driverData.items[0].trailerPlateNo && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('notificationDetails.trailer')}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {driverData.items[0].trailerPlateNo}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          )}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              {t('summary.registeredNotifications')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {isLoading ? (
                <ListItem>
                  <ListItemIcon>
                    <CircularProgress size={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        Ładowanie notyfikacji...
                      </Typography>
                    }
                  />
                </ListItem>
              ) : (
                (data?.items || []).map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <LocalShippingIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {notification.number || `ID: ${notification.id}`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {notification.cargoDescription} • {notification.weight} kg
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t('summary.nextSteps')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Alert severity="info">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('summary.waitForSMS')}
                </Typography>
              </Alert>
              <Alert severity="info">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('summary.goToScale')}
                </Typography>
              </Alert>
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/notifications')}
                sx={{
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {t('common.back')}
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CheckCircleIcon />
                  )
                }
                onClick={handleFinish}
                disabled={submitting}
                sx={{
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {submitting ? t('summary.submitting') : t('summary.finish')}
              </Button>
            </Box>
          </Stack>

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Demo mode:</strong> Po kliknięciu "Zakończ" rejestracja zostanie
              zresetowana i wrócisz do ekranu wyboru języka.
            </Typography>
          </Alert>
        </Stack>
      </Container>
    </Layout>
  );
};

export default SummaryScreen;
