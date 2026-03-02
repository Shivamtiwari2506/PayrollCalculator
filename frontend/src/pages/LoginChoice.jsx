import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

export default function LoginChoice() {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" className="mb-2 text-center font-bold">
        Welcome
      </Typography>
      <Typography variant="body1" className="mb-8 text-center text-gray-600">
        Choose how you want to continue
      </Typography>

      <Box className="space-y-4">
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<PersonIcon />}
          onClick={() => navigate('/login/user')}
          sx={{ py: 2 }}
        >
          User Login
        </Button>

        <Button
          variant="outlined"
          fullWidth
          size="large"
          startIcon={<BusinessIcon />}
          onClick={() => navigate('/login/organization')}
          sx={{ py: 2 }}
        >
          Create Organization
        </Button>
      </Box>
    </>
  );
}
