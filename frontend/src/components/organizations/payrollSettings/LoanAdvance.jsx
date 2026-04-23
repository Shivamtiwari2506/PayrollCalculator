import { Grid, Card, CardContent, Typography, TextField, Switch, FormControlLabel, InputAdornment, Chip, Box } from "@mui/material";
import CurrencyInput from "../../ui/CurrencyInput";

const LoanAdvance = ({ settings, handleChange, errors }) => {
  return (
    <Grid container spacing={3}>
      {/* Loan Configuration */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Employee Loan
              </Typography>
              <Chip 
                label={settings.loanEnabled ? "Active" : "Inactive"} 
                color={settings.loanEnabled ? "info" : "default"} 
                size="small"
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.loanEnabled}
                  onChange={(e) => handleChange("loanEnabled", e.target.checked)}
                />
              }
              label="Enable Employee Loans"
            />

            {settings.loanEnabled && (
              <CurrencyInput
                label="Maximum Loan Amount"
                value={settings.maxLoanAmount}
                onChange={(val) =>
                  handleChange("maxLoanAmount", val)
                }
                required={settings.loanEnabled ? true : false}
                error={!!errors.maxLoanAmount}
                helperText={errors.maxLoanAmount}
                sx={{ mt: 2 }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Advance Salary */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Advance Salary
              </Typography>
              <Chip 
                label={settings.advanceEnabled ? "Active" : "Inactive"} 
                color={settings.advanceEnabled ? "info" : "default"} 
                size="small"
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.advanceEnabled}
                  onChange={(e) => handleChange("advanceEnabled", e.target.checked)}
                />
              }
              label="Enable Advance Salary"
            />

            {settings.advanceEnabled && (
              <CurrencyInput
                label="Maximum Advance Amount"
                value={settings.maxAdvanceAmount}
                onChange={(val) =>
                  handleChange("maxAdvanceAmount", val)
                }
                fullWidth
                required={settings.advanceEnabled ? true : false}
                error={!!errors.maxAdvanceAmount}
                helperText={errors.maxAdvanceAmount}
                sx={{ mt: 2 }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LoanAdvance;
