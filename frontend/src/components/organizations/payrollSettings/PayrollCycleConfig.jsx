import { Grid, Card, CardContent, Typography, TextField, MenuItem, Box, FormControl, InputLabel, Select, OutlinedInput, Chip, FormHelperText, Alert } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from "react";
import { useEffect } from "react";

const today = new Date().toISOString().split('T')[0];

const PayrollCycleConfig = ({ settings, handleChange , errors}) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [cycleWarning, setCycleWarning] = useState("");

  useEffect(() => {
    if (settings.cycleConfig?.payrollStartDay && settings.cycleConfig?.payrollEndDay && settings.cycleConfig?.payrollStartDay >= settings.cycleConfig?.payrollEndDay) {
      setCycleWarning("This will be treated as a cross-month payroll cycle.");
    } else {
      setCycleWarning("");
    }
  }, [settings]);

  return (
    <Card elevation={2} sx={{ borderRadius: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CalendarTodayIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Payroll Cycle Configuration
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                Define your payroll processing schedule
              </Typography>

              <Chip
                label={
                  settings.payrollCycle === "biweekly"
                    ? "Bi-Weekly"
                    : settings.payrollCycle === "monthly"
                      ? "Monthly"
                      : "Weekly"
                }
                size="small"
                color="primary"
                sx={{ fontWeight: 500 }}
              />

              {settings.payrollCycle === "monthly" && (
                <Alert
                  severity="info"
                  sx={{
                    py: 0,
                    px: 1,
                    alignItems: "center",
                    display: "flex",
                    fontSize: "0.75rem",
                  }}
                >
                  If the upcoming month has fewer than 31 days, system uses last day.
                </Alert>
              )}
            </Box>
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
            {settings.payrollCycle === "monthly" ? <TextField
              type="number"
              fullWidth
              required={true}
              label="Payroll Start Day"
              value={settings.cycleConfig.payrollStartDay}
              onChange={(e) => handleChange("cycleConfig.payrollStartDay", parseInt(e.target.value))}
              inputProps={{ min: 1, max: 31 }}
              error={!!errors["cycleConfig.payrollStartDay"]}
              helperText={errors["cycleConfig.payrollStartDay"]}
            /> :
              <TextField
                select
                fullWidth
                required={true}
                label="Week Start Day"
                value={settings.cycleConfig.payrollStartDay || ""}
                onChange={(e) => handleChange("cycleConfig.payrollStartDay", e.target.value)}
                error={!!errors["cycleConfig.payrollStartDay"]}
                helperText={errors["cycleConfig.payrollStartDay"]}
              >
                {weekDays.map(day => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>}
          </Grid>

          {settings.payrollCycle !== "biweekly" && (
            <Grid item xs={12} md={3}>
              {settings.payrollCycle === "monthly" ? (
                <TextField
                  type="number"
                  fullWidth
                  required
                  label="Payroll End Day"
                  value={settings.cycleConfig.payrollEndDay ?? ""}
                  onChange={(e) => handleChange("cycleConfig.payrollEndDay", parseInt(e.target.value, 10))}
                  inputProps={{ min: 1, max: 31 }}
                  error={!!errors["cycleConfig.payrollEndDay"]}
                  helperText={errors["cycleConfig.payrollEndDay"]}
                />
              ) : (
                <TextField
                  select
                  fullWidth
                  required
                  label="Week End Day"
                  value={settings.cycleConfig.payrollEndDay ?? ""}
                  onChange={(e) => handleChange("cycleConfig.payrollEndDay", e.target.value)}
                  error={!!errors["cycleConfig.payrollEndDay"]}
                  helperText={errors["cycleConfig.payrollEndDay"]}
                >
                  {weekDays.map(day => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            {settings.payrollCycle === "monthly" ? <TextField
              type="number"
              fullWidth
              required={true}
              label="Payment Date"
              value={settings.cycleConfig.paymentDate}
              onChange={(e) => handleChange("cycleConfig.paymentDate", parseInt(e.target.value))}
              inputProps={{ min: 1, max: 31 }}
              error={!!errors["cycleConfig.paymentDate"]}
              helperText={errors["cycleConfig.paymentDate"] || "Day of month for salary credit"}
            /> : <TextField
              select
              fullWidth
              required={true}
              label="Payment Day"
              value={settings.cycleConfig.paymentDate}
              onChange={(e) => handleChange("cycleConfig.paymentDate", e.target.value)}
              error={!!errors["cycleConfig.paymentDate"]}
              helperText={errors["cycleConfig.paymentDate"]}
            >
              {weekDays.map(day => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>}
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
              inputProps={{
                min: today
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            {cycleWarning && (
              <Alert severity="warning" sx={{ py: 1, px: 2 }}>
                {cycleWarning}
              </Alert>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollCycleConfig;
