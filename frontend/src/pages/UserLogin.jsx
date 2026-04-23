import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';
import { toast } from 'react-toastify';
import { handleApiError } from '../utils/commonFunctions/errorHandler';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res?.data && res.data?.success === true) {
        toast.success('Login successful');
        localStorage.setItem('token', res?.data?.token);
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box className="flex items-center mb-8">
        <IconButton onClick={() => navigate('/login')} className="mr-2">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" className="font-bold">
          User Login
        </Typography>
      </Box>

      <Typography variant="body1" className="mb-8 text-gray-600">
        Sign in to your account
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={
            {
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }
          }
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="mt-6"
          disabled={loading}
          sx={{ py: 1.5 }}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? '' : 'Login'}
        </Button>

        <Button
          fullWidth
          className="mt-3"
        >
          Forgot password?
        </Button>
      </form>
    </>
  );
}
