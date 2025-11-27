import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    Divider,
    Alert,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Layout from '../../components/Layout/Layout';
import { useNotifications } from '../../context/NotificationContext';
import { useVerifyNotification } from '../../api/hooks';
import { NotificationUseCase } from '../../services/notificationUseCase';
import type { NotificationDetails } from '../../api/types';

const NotificationDetailsScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { addNotification } = useNotifications();
    const { mutateAsync: verifyNotificationAsync, isPending: isVerifying } = useVerifyNotification();
    const [dataConfirmed, setDataConfirmed] = useState(false);
    const [sentNumber, setSentNumber] = useState('');
    const [sentError, setSentError] = useState<string>('');
    const [bdoCode, setBdoCode] = useState(''); 
    const [wasteCodes, setWasteCodes] = useState<Record<string, string>>({});
    const [notificationData, setNotificationData] = useState<NotificationDetails | null>(null);

    const locationState = location.state as {
        searchValue?: string;
        searchType?: string;
        notificationData?: NotificationDetails;
        isEdit?: boolean;
    } | null;

    useEffect(() => {
        if (locationState?.notificationData) {
            setNotificationData(locationState.notificationData);
        } else if (params.id) {
            const notificationId = parseInt(params.id, 10);
            const savedData = NotificationUseCase.getNotificationDetails(notificationId);
            if (savedData) {
                setNotificationData(savedData);
            }
        }
    }, [locationState, params.id]);

    useEffect(() => {
        if (notificationData?.cargoItems) {
            const initialWasteCodes: Record<string, string> = {};
            notificationData.cargoItems.forEach(item => {
                if (item.declaredWasteCode) {
                    initialWasteCodes[item.id.toString()] = "";
                }
            });
            setWasteCodes(initialWasteCodes);
        }
    }, [notificationData]);

    const handleSentChange = (value: string) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 4);
        setSentNumber(numericValue);
        if (numericValue.length > 0 && numericValue.length !== 4) {
            setSentError('Numer SENT musi składać się z 4 cyfr');
        } else {
            setSentError('');
        }
    };

    const handleConfirm = async () => {
        if (!dataConfirmed || !notificationData) {
            console.error('Cannot confirm: dataConfirmed=', dataConfirmed, 'notificationData=', notificationData);
            return;
        }

        const isShipment = notificationData.transportType === 'L';
        const sentNo = isShipment ? '' : (notificationData.isForeign ? sentNumber : '');
        const bdoCodeValue = isShipment ? '' : (notificationData.isForeign ? '' : bdoCode);

        if (!isShipment && notificationData.isForeign && sentNumber.length !== 4) {
            setSentError('Numer SENT musi składać się z 4 cyfr');
            return;
        }

        const verifyBody = {
            notificationId: notificationData.id,
            sentNo: sentNo || '',
            bdoCode: bdoCodeValue || '',
            items: notificationData.cargoItems.map(item => ({
                cargoItemId: item.id,
                wasteCode: wasteCodes[item.id.toString()] || item.declaredWasteCode || ''
            }))
        };


        try {
            const response = await verifyNotificationAsync(verifyBody);
            
            NotificationUseCase.saveNotificationDetails(notificationData);
            
            NotificationUseCase.processVerificationResponse(notificationData.id, {
                items: response.items || undefined
            });

            addNotification(notificationData.id);
            navigate('/notifications', { replace: true });
        } catch (error) {
            console.error('Verification failed:', error);
        }
    };

    const renderCargoFields = () => {
        if (!notificationData) return null;
        const isShipment = notificationData.transportType === 'L';
        const showSentOrBdo = !isShipment;

        return (
            <>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Nazwa</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Waga (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t('notificationDetails.wasteCode')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notificationData.cargoItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.cargoName}</TableCell>
                                    <TableCell>{item.weight}</TableCell>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            value={wasteCodes[item.id.toString()] || ''}
                                            onChange={(e) =>
                                                setWasteCodes({ ...wasteCodes, [item.id.toString()]: e.target.value })
                                            }
                                            size="small"
                                            placeholder="Wprowadź kod odpadu..."
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {showSentOrBdo && (
                    <Box sx={{ mt: 2 }}>
                        {notificationData.isForeign ? (
                            <TextField
                                fullWidth
                                label={t('notificationDetails.sentNumber')}
                                value={sentNumber}
                                onChange={(e) => handleSentChange(e.target.value)}
                                size="small"
                                placeholder="Wprowadź numer SENT (4 cyfry)..."
                                error={!!sentError}
                                helperText={sentError || 'Wprowadź 4-cyfrowy numer SENT'}
                                inputProps={{
                                    maxLength: 4,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]{4}',
                                }}
                                sx={{ maxWidth: 400 }}
                            />
                        ) : (
                            <TextField
                                fullWidth
                                label={t('notificationDetails.bdoCode')}
                                value={bdoCode}
                                onChange={(e) => setBdoCode(e.target.value)}
                                size="small"
                                placeholder="Wprowadź kody BDO..."
                                sx={{ maxWidth: 400 }}
                            />
                        )}
                    </Box>
                )}
            </>
        );
    };

    if (!notificationData) {
        return (
            <Layout title={t('notificationDetails.title')} showLanguageSwitch>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('common.error')}
                        </Typography>
                        <Typography>
                            Nie znaleziono danych notyfikacji. Wróć do wyszukiwania.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/search')}
                            sx={{ mt: 2 }}
                        >
                            {t('common.back')}
                        </Button>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout
            title={t('notificationDetails.title')}
            showLanguageSwitch
        >
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {notificationData.id}
                        </Typography>
                        <Chip
                            label={t(`notificationTypes.${notificationData.transportType === 'L'
                                    ? 'shipment'
                                    : (notificationData.isForeign ? 'foreign' : 'domestic')
                                }`)}
                            color="primary"
                            size="medium"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Paper sx={{ p: 2, flex: 1 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {t('notificationDetails.driverInfo')}
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('notificationDetails.firstName')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {notificationData.driverName.split(' ')[0]}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('notificationDetails.lastName')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {notificationData.driverName.split(' ')[1]}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 2, flex: 1 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {t('notificationDetails.vehicleInfo')}
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('notificationDetails.registration')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {notificationData.truckPlateNo}
                                    </Typography>
                                </Box>
                                {notificationData.trailerPlateNo && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Naczepa
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {notificationData.trailerPlateNo}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Box>

                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {t('notificationDetails.cargoInfo')}
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        {renderCargoFields()}
                    </Paper>
                    <Paper sx={{ p: 2, bgcolor: dataConfirmed ? '#ffa726' : 'white' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={dataConfirmed}
                                    onChange={(e) => setDataConfirmed(e.target.checked)}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: 'white',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {t('notificationDetails.confirmDataAccuracy')}
                                </Typography>
                            }
                        />
                    </Paper>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 1 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => {
                                navigate('/search', { replace: true });
                            }}
                            sx={{
                                py: 1.5,
                                fontSize: '1.125rem',
                                fontWeight: 600,
                            }}
                        >
                            {t('common.back')}
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleConfirm}
                            disabled={!dataConfirmed || isVerifying || !!sentError}
                            sx={{
                                py: 1.5,
                                fontSize: '1.125rem',
                                fontWeight: 600,
                            }}
                        >
                            {t('common.confirm')}
                        </Button>
                    </Box>
                </Stack>
            </Container>
        </Layout>
    );
};

export default NotificationDetailsScreen;
