import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper } from '@mui/material';
import api from '../services/api';
import { toast } from 'react-toastify';
import { handleApiError } from '../utils/commonFunctions/errorHandler';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', { email, password, name });
      if (res?.data && res?.data?.success === true) {
        toast.success("organization created successfully please login");
        navigate('/login');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Paper elevation={3} className="p-8">
      <Typography variant="h4" className="mb-6 text-center">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth className="mt-4">
          Register
        </Button>
        <Button onClick={() => navigate('/login')} fullWidth className="mt-2">
          Back to Login
        </Button>
      </form>
    </Paper>
  );
}
