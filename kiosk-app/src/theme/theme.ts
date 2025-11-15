import { createTheme } from '@mui/material/styles';

// Alumetal corporate colors
const alumetalOrange = '#f29400'; // Główny kolor marki
const alumetalOrangeLight = '#ffa726';
const alumetalOrangeDark = '#d68200';
const alumetalGray = '#ededed';

export const theme = createTheme({
    palette: {
        primary: {
            main: alumetalOrange,
            light: alumetalOrangeLight,
            dark: alumetalOrangeDark,
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#424242',
            light: '#6d6d6d',
            dark: '#1b1b1b',
            contrastText: '#ffffff',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ffa726',
        },
        success: {
            main: '#66bb6a',
        },
        background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                },
                sizeLarge: {
                    padding: '16px 32px',
                    fontSize: '1.125rem',
                    minHeight: '56px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {

                    borderRadius: 12,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        fontSize: '1rem',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    fontWeight: 500,
                    minHeight: '56px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: `1px solid ${alumetalGray}`,
                },
            },
        },
    },
});

export default theme;
