import { Grid, Card, CardContent, Typography, TextField, Switch, MenuItem, FormControlLabel, Box, Chip } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const OvertimeBonus = ({ settings, handleChange, errors }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <Grid container spacing={3}>
      {/* Overtime Configuration */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 1.5, color: 'warning.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Overtime Configuration
              </Typography>
            </Box>

            <FormControlLabel
              sx={{font: "bold"}}
              control={
                <Switch
                  checked={settings.overtimeEnabled}
                  onChange={(e) => handleChange("overtimeEnabled", e.target.checked)}
                />
              }
              label="Enable Overtime Calculation"
            />
            <Chip
              // sx={{ ml: 2 }}
                label={settings.overtimeEnabled ? "Enabled" : "Disabled"} 
                color={settings.overtimeEnabled ? "success" : "default"} 
                size="small" 
              />

            {settings.overtimeEnabled && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Overtime Rate Multiplier"
                  type="number"
                  required={settings.overtimeEnabled ? true : false}
                  error={!!errors.overtimeRate}
                  fullWidth
                  value={settings.overtimeRate}
                  onChange={(e) => handleChange("overtimeRate", parseFloat(e.target.value))}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.1, min: 1, max: 3 }}
                  helperText={errors.overtimeRate ||"e.g., 1.5 means 1.5x of hourly rate"}
                />
                <TextField
                  select
                  fullWidth
                  required={settings.overtimeEnabled ? true : false}
                  error={!!errors.overtimeCalculation}
                  helperText={errors.overtimeCalculation}
                  label="Calculation Method"
                  value={settings.overtimeCalculation}
                  onChange={(e) => handleChange("overtimeCalculation", e.target.value)}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </TextField>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Bonus & Incentives */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptLongIcon sx={{ mr: 1.5, color: 'info.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Bonus & Incentives
              </Typography>
            </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.bonusEnabled}
                  onChange={(e) => handleChange("bonusEnabled", e.target.checked)}
                />
              }
              label="Enable Annual Bonus"
            />
            <Chip
              // sx={{ ml: 2 }}
              label={settings.bonusEnabled ? "Enabled" : "Disabled"}
              color={settings.bonusEnabled ? "success" : "default"}
              size="small"
            />
            {settings.bonusEnabled && (
              <TextField
                select
                fullWidth
                required={settings.bonusEnabled ? true : false}
                error={!!errors.bonusMonth}
                helperText={errors.bonusMonth}
                label="Bonus Month"
                value={settings.bonusMonth}
                onChange={(e) => handleChange("bonusMonth", e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              >
                {months.map(month => (
                  <MenuItem key={month} value={month}>{month}</MenuItem>
                ))}
              </TextField>
            )}
            </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.performanceBonusEnabled}
                  onChange={(e) => handleChange("performanceBonusEnabled", e.target.checked)}
                />
              }
              label="Enable Performance Bonus"
            />
            <Chip
              label={settings.performanceBonusEnabled ? "Enabled" : "Disabled"}
              color={settings.performanceBonusEnabled ? "success" : "default"}
              size="small"
            />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OvertimeBonus;
