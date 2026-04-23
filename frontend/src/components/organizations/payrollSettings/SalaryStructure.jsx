import { Grid, Card, CardContent, Typography, TextField, Box, InputAdornment, Paper, Chip } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const SalaryStructure = ({ settings, handleChange, errors, viewSavedConfig }) => {
  const total = parseFloat(settings.basicPercent) + parseFloat(settings.hraPercent) + parseFloat(settings.allowancePercent);
  const isValid = total === 100;

  return (
    <Card elevation={2} sx={{ borderRadius: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccountBalanceWalletIcon sx={{ mr: 1.5, color: 'success.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Salary Structure ({total.toFixed(2)}%)
              {isValid ? (
                  <Chip label="Valid" color="success" size="small" sx={{ ml: 2 }} icon={<CheckCircleIcon />} />
                ) : (
                  <Chip label="Invalid" color="error" size="small" sx={{ ml: 2 }} icon={<CancelIcon />} />
                )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure salary component distribution (Total should be 100%)
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Basic Salary"
              fullWidth
              disabled={viewSavedConfig}
              type="number"
              required={true}
              error={!!errors.basicPercent}
              helperText={errors.basicPercent}
              value={settings.basicPercent}
              onChange={(e) => handleChange("basicPercent", parseFloat(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ step: 0.1, min: 0, max: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="House Rent Allowance (HRA)"
              fullWidth
              disabled={viewSavedConfig}
              type="number"
              required={true}
              error={!!errors.hraPercent}
              helperText={errors.hraPercent}
              value={settings.hraPercent}
              onChange={(e) => handleChange("hraPercent", parseFloat(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ step: 0.1, min: 0, max: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Special/Other Allowances"
              fullWidth
              disabled={viewSavedConfig}
              type="number"
              required={true}
              error={!!errors.allowancePercent}
              helperText={errors.allowancePercent}
              value={settings.allowancePercent}
              onChange={(e) => handleChange("allowancePercent", parseFloat(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ step: 0.1, min: 0, max: 100 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SalaryStructure;
