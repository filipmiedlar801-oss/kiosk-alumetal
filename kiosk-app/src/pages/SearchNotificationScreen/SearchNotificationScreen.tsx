import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PinIcon from '@mui/icons-material/Pin';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Layout from '../../components/Layout/Layout';
import { useFindNotification } from '../../api/hooks';
import { SearchMode } from '../../api/types';

type SearchTab = 'pin' | 'order' | 'shipment' | 'qr';

const SearchNotificationScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SearchTab>('pin');
  const [searchValue, setSearchValue] = useState('');

  const getSearchMode = (tab: SearchTab): SearchMode => {
    switch (tab) {
      case 'pin':
        return SearchMode.PIN;
      case 'order':
      case 'shipment':
        return SearchMode.ORDER_ID;
      case 'qr':
        return SearchMode.QR_CODE;
    }
  };

  const { mutate: searchNotification, data, isPending: isLoading, error } = useFindNotification();

  React.useEffect(() => {
    if (data) {
      if (data.success && data.items && data.items.length > 0) {
        const notificationData = data.items[0];
        const driverData = {
          driverName: notificationData.driverName,
          personalIdNo: notificationData.personalIdNo,
          truckPlateNo: notificationData.truckPlateNo,
          trailerPlateNo: notificationData.trailerPlateNo,
        };
        localStorage.setItem('alumetal-driver-data', JSON.stringify(driverData));
        navigate(`/notification/${notificationData.id}`, {
          state: {
            searchValue,
            searchType: activeTab,
            notificationData: notificationData,
          }
        });
      }
    }
  }, [data, navigate, searchValue, activeTab]);

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) {
      return;
    }
    searchNotification({
      mode: getSearchMode(activeTab),
      code: trimmedValue,
    });
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: SearchTab) => {
    setActiveTab(newValue);
    setSearchValue('');
  };

  const handleQRScan = () => {
    // TODO: QR SCANNER
    alert('qr todo');
  };

  const renderSearchInput = () => {
    switch (activeTab) {
      case 'pin':
        return (
          <TextField
            fullWidth
            label={t('search.placeholders.pin')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="number"
            variant="outlined"
            size="medium"
            autoFocus
            error={!!error || (data && !data.success)}
            helperText={error?.message || (data && !data.success ? (data.message || t('search.noResults')) : '')}
            sx={{ mb: 3 }}
          />
        );
      case 'order':
        return (
          <TextField
            fullWidth
            label={t('search.placeholders.orderNumber')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outlined"
            size="medium"
            autoFocus
            error={!!error || (data && !data.success)}
            helperText={error?.message || (data && !data.success ? (data.message || t('search.noResults')) : '')}
            sx={{ mb: 3 }}
          />
        );
      case 'shipment':
        return (
          <TextField
            fullWidth
            label={t('search.placeholders.shipmentId')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outlined"
            size="medium"
            autoFocus
            error={!!error || (data && !data.success)}
            helperText={error?.message || (data && !data.success ? (data.message || t('search.noResults')) : '')}
            sx={{ mb: 3 }}
          />
        );
        return (
          <>
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'grey.50',
                mb: 3,
              }}
            >
              <QrCodeScannerIcon sx={{ fontSize: 120, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {t('search.scanQR')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleQRScan}
                sx={{ mt: 2 }}
              >
                Uruchom skaner
              </Button>
            </Paper>
            <Box sx={{ display: 'flex', gap: 2 }}>
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
            </Box>
          </>
        );
    }
  };

  return (
    <Layout
      title={t('search.title')}
      showLanguageSwitch
    >
      <Container maxWidth="md">
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Tab
              value="order"
              label={t('search.methods.orderNumber')}
              icon={<ReceiptIcon />}
              iconPosition="start"
              sx={{ py: 2, fontSize: '1rem' }}
            />
            <Tab
              value="pin"
              label={t('search.methods.pin')}
              icon={<PinIcon />}
              iconPosition="start"
              sx={{ py: 2, fontSize: '1rem' }}
            />

            <Tab
              value="shipment"
              label={t('search.methods.shipmentId')}
              icon={<LocalShippingIcon />}
              iconPosition="start"
              sx={{ py: 2, fontSize: '1rem' }}
            />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {renderSearchInput()}

            {activeTab !== 'qr' && (
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
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  onClick={handleSearch}
                  disabled={isLoading || !searchValue.trim()}
                  sx={{
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                  }}
                >
                  {isLoading ? t('common.loading') : t('common.search')}
                </Button>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error.message || t('search.error')}
              </Alert>
            )}
            {data && !data.success && !error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {data.message || t('search.noResults')}
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SearchNotificationScreen;
