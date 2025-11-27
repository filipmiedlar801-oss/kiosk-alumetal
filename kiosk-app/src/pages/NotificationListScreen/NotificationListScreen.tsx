import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import { useNotifications } from '../../context/NotificationContext';
import Layout from '../../components/Layout/Layout';
import NotificationCard from '../../components/NotificationCard/NotificationCard';
import { useState } from 'react';
import { useNotificationsById } from '../../api/hooks';
import { NotificationUseCase } from '../../services/notificationUseCase';

const NotificationListScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { notificationIds, removeNotification } = useNotifications();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
  
  const { data, isLoading, error } = useNotificationsById(notificationIds);

  const handleAddNotification = () => {
    navigate('/search');
  };

  const handleContinue = () => {
    if (notificationIds.length === 0) {
      return;
    }
    
    if (NotificationUseCase.hasInconsistencies()) {
      navigate('/inconsistencies');
      return;
    }
    
    navigate('/summary');
  };

  const handleRemoveClick = (id: number) => {
    setSelectedNotificationId(id);
    setRemoveDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (selectedNotificationId !== null) {
      removeNotification(selectedNotificationId);
    }
    setRemoveDialogOpen(false);
    setSelectedNotificationId(null);
  };

  const handleEdit = (id: number) => {
    const notificationData = NotificationUseCase.getNotificationDetails(id);
    if (notificationData) {
      navigate(`/notification/${id}`, {
        state: {
          notificationData: notificationData,
          isEdit: true,
        }
      });
    } else {
      console.warn(`Notification details not found in localStorage for ID: ${id}`);
      navigate('/search');
    }
  };

  return (
    <Layout
      title={t('notificationList.title')}
      showLanguageSwitch
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined" 
            size="medium"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleAddNotification}
            sx={{
              py: 2,
              backgroundColor: 'white',
            }}
          >
            {t('notificationList.addNotification')}
          </Button>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', mb: 3 }}>
          {notificationIds.length === 0 && (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 3,
              }}
            >
              <InboxIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {t('notificationList.empty')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('notificationList.emptyDescription')}
              </Typography>
            </Paper>
          )}

          {isLoading && notificationIds.length > 0 && (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 3,
              }}
            >
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Ładowanie notyfikacji...
              </Typography>
            </Paper>
          )}

          {error && notificationIds.length > 0 && (
            <Paper
              sx={{
                p: 3,
                bgcolor: 'error.light',
                borderRadius: 3,
              }}
            >
              <Typography variant="body2" color="error">
                Błąd ładowania notyfikacji. Spróbuj odświeżyć stronę.
              </Typography>
            </Paper>
          )}

          {!isLoading && !error && data?.items && data.items.length > 0 && (
            <Stack spacing={2}>
              {data.items.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onRemove={handleRemoveClick}
                  onEdit={handleEdit}
                />
              ))}
            </Stack>
          )}

          {!isLoading && !error && notificationIds.length > 0 && (!data?.items || data.items.length === 0) && (
            <Paper
              sx={{
                p: 3,
                bgcolor: 'warning.light',
                borderRadius: 3,
              }}
            >
              <Typography variant="body2" color="warning.dark">
                Nie udało się załadować notyfikacji. Sprawdź połączenie z internetem.
              </Typography>
            </Paper>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Stack spacing={2}>
            {notificationIds.length === 0 && (
              <Alert severity="info" sx={{ fontSize: '1rem' }}>
                {t('notificationList.minOneRequired')}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/language')}
                sx={{
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {t('common.back')}
              </Button>

              {notificationIds.length > 0 && (
                <Button
                  variant="contained"
                
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleContinue}
                  sx={{
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                  }}
                >
                  {t('notificationList.allAdded')}
                </Button>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>

      <Dialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
      >
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          <Typography>{t('notificationList.removeConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleRemoveConfirm} color="error" variant="contained">
            {t('common.remove')}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default NotificationListScreen;
