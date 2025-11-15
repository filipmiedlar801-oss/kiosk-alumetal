import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import type { NotificationDetails } from '../../api/types';

const NotificationDetailsScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { addNotification } = useNotifications();
    const [dataConfirmed, setDataConfirmed] = useState(false);
    const [sentNumber, setSentNumber] = useState(''); // Tylko jeden numer SENT dla całej notyfikacji
    const [bdoCodes, setBdoCodes] = useState<Record<string, string>>({});
    const [wasteCodes, setWasteCodes] = useState<Record<string, string>>({});

    const locationState = location.state as {
        searchValue?: string;
        searchType?: string;
        notificationData?: NotificationDetails;
    } | null;

    const notificationData = locationState?.notificationData;

    useEffect(() => {
        if (notificationData?.cargoItems) {
            const initialWasteCodes: Record<string, string> = {};
            notificationData.cargoItems.forEach(item => {
                if (item.declaredWasteCode) {
                    initialWasteCodes[item.id.toString()] = item.declaredWasteCode;
                }
            });
            setWasteCodes(initialWasteCodes);
        }
    }, [notificationData?.id]);

    const handleConfirm = () => {
        if (!dataConfirmed || !notificationData) {
            console.error('Cannot confirm: dataConfirmed=', dataConfirmed, 'notificationData=', notificationData);
            return;
        }

        addNotification(notificationData.id);

        navigate('/notifications', { replace: true });
    };

    const renderCargoFields = () => {
        if (!notificationData) return null;

        if (notificationData.isForeign) {
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

                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label={t('notificationDetails.sentNumber')}
                            value={sentNumber}
                            onChange={(e) => setSentNumber(e.target.value)}
                            size="small"
                            placeholder="Wprowadź numer SENT..."
                            sx={{ maxWidth: 400 }}
                        />
                    </Box>
                </>
            );
        }

        if (!notificationData.isForeign) {
            return (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Nazwa</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Waga (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{t('notificationDetails.bdoCode')}</TableCell>
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
                                            value={bdoCodes[item.id.toString()] || ''}
                                            onChange={(e) => setBdoCodes({ ...bdoCodes, [item.id.toString()]: e.target.value })}
                                            size="small"
                                            placeholder="Wprowadź kod BDO..."
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        return (
            <Alert severity="info">
                <Typography variant="body2">
                    Wysyłka - nie wymaga dodatkowych pól. Potwierdź zgodność danych poniżej.
                </Typography>
            </Alert>
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
                            label={t(`notificationTypes.${notificationData.isForeign ? 'foreign' : 'domestic'}`)}
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
                            disabled={!dataConfirmed}
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
