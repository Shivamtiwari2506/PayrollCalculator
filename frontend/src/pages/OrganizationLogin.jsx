import { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';
import { toast } from 'react-toastify';
import { handleApiError } from '../utils/commonFunctions/errorHandler';

export default function OrganizationLogin() {
  const [formData, setFormData] = useState({
    organizationName: '',
    adminEmail: '',
    adminPassword: '',
    organizationDomain: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { organizationName, adminEmail, adminPassword, adminName } = formData;
    
    if (!organizationName || !adminEmail || !adminPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/org/create', {
        orgEmail: adminEmail,
        password: adminPassword,
        orgName: organizationName,
      });

      if (res?.data && res.data?.success === true) {
        toast.success('Organization created successfully');
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
          Create Organization
        </Typography>
      </Box>

      <Typography variant="body1" className="mb-8 text-gray-600">
        Set up your organization and admin account
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Organization Name"
          value={formData.organizationName}
          onChange={handleChange('organizationName')}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Organization Domain (Optional)"
          value={formData.organizationDomain}
          onChange={handleChange('organizationDomain')}
          margin="normal"
          placeholder="example.com"
        />

        <Typography variant="subtitle2" className="mt-4 mb-2 font-semibold">
          Admin Account Details
        </Typography>

        <TextField
          fullWidth
          label="Admin Email"
          type="email"
          value={formData.adminEmail}
          onChange={handleChange('adminEmail')}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Admin Password"
          type="password"
          value={formData.adminPassword}
          onChange={handleChange('adminPassword')}
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="mt-6"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Creating...' : 'Create Organization'}
        </Button>

        <Button
          onClick={() => navigate('/login/user')}
          fullWidth
          className="mt-3"
        >
          Already have an account? Login
        </Button>
      </form>
    </>
  );
}
