import { Paper, Typography, Button } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

interface QRScannerProps {
  onScan: (value: string) => void;
  onError?: (error: string) => void;
}

// SUPPRESS UNUSED PARAMETER WARNING
export { };

const QRScanner = ({ onScan }: QRScannerProps) => {


  const handleStartScan = () => {
    // FAKE SCAN
    onScan('MOCK_QR_CODE_12345');
    alert('qr todo');
  };

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <QrCodeScannerIcon sx={{ fontSize: 120, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Skaner kodów QR
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Zeskanuj kod QR umieszczony na dokumencie awizacji
      </Typography>
      <Button variant="contained" size="large" onClick={handleStartScan}>
        Uruchom skaner kamery
      </Button>
    </Paper>
  );
};

export default QRScanner;

