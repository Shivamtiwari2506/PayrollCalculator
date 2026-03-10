import { Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useEffect, useState } from 'react';
import axios from 'axios';

const fiscalYearOptions = [
  "January",
  "April",
  "July",
  "October",
];
const PayrollFinanceInfo = ({ form, editMode, handleChange }) => {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const timeZones = Intl.supportedValuesOf("timeZone");

  useEffect(() => {
    axios.get('https://api.frankfurter.dev/v1/currencies').then((response) => {
      const data = response.data;
      const currencies = Object.entries(data).map(([code, name]) => ({
        code,
        label: `${code} - ${name}`,
      }));
      currencies.sort((a, b) => a.label.localeCompare(b.label));

      setCurrencyOptions(currencies);
    })
      .catch((err) => {
        console.error("Failed to load currencies:", err.message);
        setCurrencyOptions([{ code: "INR", label: "INR - Indian Rupee" }]);
      });
  }, []);

  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 1 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          <PaymentsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Payroll & Financial Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Currency"
              select
              fullWidth
              value={form.currency}
              disabled={!editMode}
              onChange={(e) => handleChange("currency", e.target.value)}
            >
              {currencyOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Time Zone"
              select
              fullWidth
              value={form.timezone || ""}
              disabled={!editMode}
              onChange={(e) => handleChange("timezone", e.target.value)}
            >
              {timeZones.map((zone) => (
                <MenuItem key={zone} value={zone}>
                  {zone}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <TextField
              label="Fiscal Year Start"
              select
              fullWidth
              value={form.fiscalYearStart}
              disabled={!editMode}
              onChange={(e) => handleChange("fiscalYearStart", e.target.value)}
            >
              {fiscalYearOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Payroll Start Date (Day of Month)"
              fullWidth
              type="number"
              value={form.payrollStartDate}
              disabled={!editMode}
              onChange={(e) => handleChange("payrollStartDate", e.target.value)}
              inputProps={{ min: 1, max: 31 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Working Days"
              fullWidth
              value={form.workingDays}
              disabled={!editMode}
              onChange={(e) => handleChange("workingDays", e.target.value)}
            />
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PayrollFinanceInfo