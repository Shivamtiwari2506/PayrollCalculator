import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 120, color: 'primary.main', mb: 2 }} />
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
