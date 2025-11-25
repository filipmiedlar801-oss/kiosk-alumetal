    import { useState, useEffect } from 'react';
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
    } from '@mui/material';
    import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
    import CheckCircleIcon from '@mui/icons-material/CheckCircle';
    import Layout from '../../components/Layout/Layout';
    import type { InconsistencyData } from '../../api/types';
    import { useSendInconsistencyEmail } from '../../api/hooks';
    import { useNavigate } from 'react-router-dom';
    import { useNotifications } from '../../context/NotificationContext';

    const InconsistenciesScreen = () => {
        const { t } = useTranslation();
        const navigate = useNavigate();
        const [inconsistencies, setInconsistencies] = useState<InconsistencyData[]>(() => {
            const savedInconsistencies = localStorage.getItem('alumetal-inconsistencies');
            if (savedInconsistencies) {
                try {
                    const inconsistenciesArray: InconsistencyData[] = JSON.parse(savedInconsistencies);
                    return inconsistenciesArray.filter(item => item.items && item.items.length > 0);
                } catch (e) {
                    console.error('Error parsing inconsistencies from localStorage:', e);
                }
            }
            return [];
        });
        const { mutateAsync: sendInconsistencyEmailAsync, isPending: isSendingEmail } = useSendInconsistencyEmail();
        const { clearAllNotifications } = useNotifications();

        const handleFinish = () => {
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
                    localStorage.removeItem('alumetal-inconsistencies');
                    localStorage.removeItem('alumetal-driver-data');
                    clearAllNotifications();
                    navigate('/language');
                }
            }).catch((error) => {
                console.error('Error sending email:', error);
            });
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
                                                        {item.description}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                            <strong>{t('inconsistencies.sootData')}:</strong> {item.sootData}
                                                        </Typography>
                                                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                            <strong>{t('inconsistencies.paperData')}:</strong> {item.paperData}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ))}


                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={isSendingEmail ? <CircularProgress size={24} /> : <CheckCircleIcon />}
                                    disabled={isSendingEmail}
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
                        </Stack>
                    </Stack>
                </Container>
            </Layout>
        );
    };

    export default InconsistenciesScreen;

