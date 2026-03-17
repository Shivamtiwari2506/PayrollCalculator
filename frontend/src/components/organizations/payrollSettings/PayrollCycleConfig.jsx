import { Grid, Card, CardContent, Typography, TextField, MenuItem, Box, FormControl, InputLabel, Select, OutlinedInput, Chip, FormHelperText } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const PayrollCycleConfig = ({ settings, handleChange , errors}) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Card elevation={2} sx={{ borderRadius: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CalendarTodayIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Payroll Cycle Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define your payroll processing schedule
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              required={true}
              label="Payroll Cycle"
              value={settings.payrollCycle}
              onChange={(e) => handleChange("payrollCycle", e.target.value)}
              error={!!errors.payrollCycle}
              helperText={errors.payrollCycle}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="biweekly">Bi-Weekly</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="number"
              fullWidth
              required={true}
              label="Payroll Start Day"
              value={settings.payrollStartDay}
              onChange={(e) => handleChange("payrollStartDay", parseInt(e.target.value))}
              inputProps={{ min: 1, max: 31 }}
              error={!!errors.payrollStartDay}
              helperText={errors.payrollStartDay}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="number"
              fullWidth
              required={true}
              label="Payroll End Day"
              value={settings.payrollEndDay}
              onChange={(e) => handleChange("payrollEndDay", parseInt(e.target.value))}
              inputProps={{ min: 1, max: 31 }}
              error={!!errors.payrollEndDay}
              helperText={errors.payrollEndDay}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="number"
              fullWidth
              required={true}
              label="Payment Date"
              value={settings.paymentDate}
              onChange={(e) => handleChange("paymentDate", parseInt(e.target.value))}
              inputProps={{ min: 1, max: 31 }}
              error={!!errors.paymentDate}
              helperText={errors.paymentDate || "Day of month for salary credit"}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="number"
              fullWidth
              required={true}
              label="Working Days per Month"
              value={settings.workingDaysPerMonth}
              onChange={(e) => handleChange("workingDaysPerMonth", parseInt(e.target.value))}
              inputProps={{ min: 20, max: 31 }}
              error={!!errors.workingDaysPerMonth}
              helperText={errors.workingDaysPerMonth}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl 
              required={true} 
              fullWidth
              error={!!errors.weekendDays}
            >
              <InputLabel>Weekend Days</InputLabel>
              <Select
                multiple
                value={settings.weekendDays}
                onChange={(e) => handleChange("weekendDays", e.target.value)}
                input={<OutlinedInput label="Weekend Days" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {weekDays.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Chip 
                      label={day} 
                      size="small" 
                      color={settings.weekendDays.includes(day) ? "primary" : "default"}
                    />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errors.weekendDays}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Effective From"
              type="date"
              required={true}
              value={settings.effectiveFrom}
              onChange={(e) => handleChange("effectiveFrom", e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.effectiveFrom}
              helperText={errors.effectiveFrom || "Start date for this configuration"}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollCycleConfig;
