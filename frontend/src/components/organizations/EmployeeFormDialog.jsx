import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Divider,
  InputAdornment,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StatusToggle from '../StatusToggle';

const EmployeeFormDialog = ({
  open,
  setOpen,
  editing,
  form,
  setForm,
  handleSubmit,
  roleOptions,
  formLoading
}) => {
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.designation || form.designation.trim().length < 2) {
      newErrors.designation = 'Designation is required';
    }

    if (!form.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of joining is required';
    }

    if (!form.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      handleSubmit();
      setErrors({});
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0px 24px 48px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      {/* Header with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, pr: 4 }}>
          {editing ? 'Edit Employee Details' : 'Add New Employee'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {editing ? 'Update employee information' : 'Fill in the details to add a new employee'}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          {/* Employee Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Employee Name"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              placeholder="employee@company.com"
              type="email"
              value={form.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Designation */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Designation"
              placeholder="e.g., Software Engineer"
              value={form.designation || ''}
              onChange={(e) => handleFieldChange('designation', e.target.value)}
              error={!!errors.designation}
              helperText={errors.designation}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Date of Joining */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Joining"
              type="date"
              value={form.dateOfJoining || ''}
              onChange={(e) => handleFieldChange('dateOfJoining', e.target.value)}
              error={!!errors.dateOfJoining}
              helperText={errors.dateOfJoining}
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Role */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Role"
              value={form.role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              error={!!errors.role}
              helperText={errors.role || 'Select user role and permissions'}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {roleOptions.filter((r) => r !== 'Admin').map((r) => (
                <MenuItem key={r} value={r}>
                  {r.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* active */}
          <StatusToggle
            value={form.active}
            onChange={(val) => handleFieldChange("active", val)}
            title="Account Activation"
            subtitle="Control login permission"
            activeLabel="Enabled"
            inactiveLabel="Disabled"
          />
        </Grid>

        {/* Info Box */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Employee will receive an email notification with their account details after creation and further details must be filled by the employee.
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          disabled={formLoading}
          size="large"
          sx={{ 
            minWidth: 100,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleFormSubmit}
          startIcon={formLoading ? <CircularProgress size={20} /> : ""}
          disabled={formLoading}
          size="large"
          sx={{ 
            minWidth: 120,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {editing ? 'Update Employee' : 'Add Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormDialog;