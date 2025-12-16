    import { useState } from 'react';
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
        Alert,
        Box,
        Divider,
        Chip,
        CircularProgress,
        Snackbar,
    } from '@mui/material';
    import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
    import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Layout from '../../components/Layout/Layout';
import type { InconsistencyData } from '../../api/types';
import { useSendInconsistencyEmail, useFinishVerification } from '../../api/hooks';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationUseCase } from '../../services/notificationUseCase';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

    const formatDescription = (description: string, t: (key: string) => string): string => {
        if (description === 'niezgodny_kod_sent') {
            return t('inconsistencies.descriptions.sentCode');
        }
        if (description === 'niezgodny_kod_bdo') {
            return t('inconsistencies.descriptions.bdoCode');
        }
        if (description === 'niezgodne_dane_kierowcy') {
            return t('inconsistencies.descriptions.driverData');
        }
        if (description.startsWith('niezgodny_kod_odpadu_dla_pozycji#')) {
            const positionName = description.replace('niezgodny_kod_odpadu_dla_pozycji#', '');
            return t('inconsistencies.descriptions.wasteCodeForPosition').replace('{{position}}', positionName);
        }
        return description;
    };

    const InconsistenciesScreen = () => {
        const { t } = useTranslation();
        const navigate = useNavigate();
        const [inconsistencies] = useState<InconsistencyData[]>(() => {
            return NotificationUseCase.getInconsistencies().filter(item => item.items && item.items.length > 0);
        });
const { mutateAsync: sendInconsistencyEmailAsync, isPending: isSendingEmail } = useSendInconsistencyEmail();
    const { mutateAsync: finishVerificationAsync, isPending: isFinishing } = useFinishVerification();
    const { clearAllNotifications } = useNotifications();
    const [emailSentSnackbar, setEmailSentSnackbar] = useState(false);

    const handleSendEmail = () => {
        const payload = inconsistencies.flatMap((inc) =>
            inc.items.map((item) => ({
                id: inc.notificationId,
                description: item.description,
                sootData: item.sootData,
                paperData: item.paperData,
            }))
        );
        sendInconsistencyEmailAsync(payload).then((response) => {
            if (response.success) {
                setEmailSentSnackbar(true);
            }
        }).catch((error) => {
            console.error('Error sending email:', error);
        });
    };

    const handleFinish = async () => {
        try {
            const payload = inconsistencies.flatMap((inc) =>
                inc.items.map((item) => ({
                    id: inc.notificationId,
                    description: item.description,
                    sootData: item.sootData,
                    paperData: item.paperData,
                }))
            );
            await finishVerificationAsync(payload);
            NotificationUseCase.clearAll();
            clearAllNotifications();
            navigate('/language');
        } catch (error) {
            console.error('Error finishing verification:', error);
            NotificationUseCase.clearAll();
            clearAllNotifications();
            navigate('/language');
        }
    };

    const handleBackToList = () => {
        navigate('/notifications');
    };

        const totalInconsistencies = inconsistencies.reduce(
            (sum, item) => sum + (item.items?.length || 0),
            0
        );

        if (inconsistencies.length === 0 || totalInconsistencies === 0) {
            return (
                <Layout title={t('inconsistencies.title')} showLanguageSwitch>
                    <Container maxWidth="md">
                        <Alert severity="info" sx={{ mt: 4 }}>
                            <Typography variant="body1">
                                {t('inconsistencies.noInconsistencies')}
                            </Typography>
                        </Alert>
                    </Container>
                </Layout>
            );
        }

        return (
            <Layout
                title={t('inconsistencies.title')}
                showLanguageSwitch
            >
                <Container maxWidth="md">
                    <Stack spacing={4}>
                        <Paper
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                bgcolor: 'background.paper',
                                borderRadius: 3,
                            }}
                        >
                            <ErrorOutlineIcon
                                sx={{
                                    fontSize: 80,
                                    color: 'error.main',
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                                {t('inconsistencies.detected')}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2, color: 'error.main' }}>
                                {t('inconsistencies.foundCount', { count: totalInconsistencies, notifCount: inconsistencies.length })}
                            </Typography>
                        </Paper>

                        {inconsistencies.map((inconsistencyData) => (
                            <Paper key={inconsistencyData.notificationId} sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {t('inconsistencies.notification')} #{inconsistencyData.notificationId}
                                    </Typography>
                                    <Chip
                                        label={`${inconsistencyData.items.length} ${inconsistencyData.items.length === 1 ? t('inconsistencies.inconsistency') : t('inconsistencies.inconsistencies_few')}`}
                                        color="error"
                                        size="small"
                                    />
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <List>
                                    {inconsistencyData.items.map((item, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                bgcolor: 'background.paper',
                                                borderRadius: 2,
                                                mb: 1,
                                                border: '1px solid',
                                                borderColor: 'error.light',
                                            }}
                                        >
                                            <ListItemIcon>
                                                <ErrorOutlineIcon color="error" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {formatDescription(item.description, t)}
                                                    </Typography>
                                                }
                                                secondary={
                                                    item.description !== 'niezgodne_dane_kierowcy' ? (
                                                        <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                                <strong>{t('inconsistencies.sootData')}:</strong> {item.sootData}
                                                            </Typography>
                                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                                <strong>{t('inconsistencies.paperData')}:</strong> {item.paperData}
                                                            </Typography>
                                                        </Box>
                                                    ) : null
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ))}


                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBackToList}
                                    sx={{
                                        py: 2,
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {t('common.back')}
                                </Button>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        color="warning"
                                        startIcon={isSendingEmail ? <CircularProgress size={24} /> : <EmailIcon />}
                                        disabled={isSendingEmail}
                                        onClick={handleSendEmail}
                                        sx={{
                                            py: 2,
                                            fontSize: '1.125rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {t('inconsistencies.sendEmail')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={isFinishing ? <CircularProgress size={24} /> : <CheckCircleIcon />}
                                        disabled={isFinishing}
                                        onClick={handleFinish}
                                        sx={{
                                            py: 2,
                                            fontSize: '1.125rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {t('inconsistencies.finish')}
                                    </Button>
                                </Box>
                            </Box>
                        </Stack>
                    </Stack>
                </Container>
                <Snackbar
                    open={emailSentSnackbar}
                    autoHideDuration={4000}
                    onClose={() => setEmailSentSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" onClose={() => setEmailSentSnackbar(false)}>
                        {t('inconsistencies.emailSent')}
                    </Alert>
                </Snackbar>
            </Layout>
        );
    };

    export default InconsistenciesScreen;

