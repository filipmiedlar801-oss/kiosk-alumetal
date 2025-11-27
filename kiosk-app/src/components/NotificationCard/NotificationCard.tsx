import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useTranslation } from 'react-i18next';
import type { NotificationSearchItem } from '../../api/types';

interface NotificationCardProps {
  notification: NotificationSearchItem;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
}

const NotificationCard = ({ notification, onRemove, onEdit }: NotificationCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        position: 'relative',

      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalShippingIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                {notification.number}
              </Typography>
              <Chip
                label={`ID: ${notification.id}`}
                color="primary"
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {notification.cargoDescription}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Waga: {notification.weight} kg
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={t('common.edit')}>
              <IconButton
                onClick={() => onEdit(notification.id)}
                color="primary"
                sx={{
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('common.remove')}>
              <IconButton
                onClick={() => onRemove(notification.id)}
                color="error"
                sx={{
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'white',
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
