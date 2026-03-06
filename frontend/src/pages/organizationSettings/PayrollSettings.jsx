import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  MenuItem,
  FormControlLabel,
  Box,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PercentIcon from '@mui/icons-material/Percent';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PayrollSettings = () => {
  const [settings, setSettings] = useState({
    // Payroll Cycle
    payrollCycle: "monthly",
    payrollStartDay: 1,
    payrollEndDay: 30,
    paymentDate: 5,
    workingDays: 26,
    weekendDays: ["Saturday", "Sunday"],
    
    // Salary Structure
    basicPercent: 50,
    hraPercent: 40,
    allowancePercent: 10,
    
    // Overtime
    overtimeEnabled: true,
    overtimeRate: 1.5,
    overtimeCalculation: "hourly",
    
    // Statutory Deductions
    pfEnabled: true,
    pfPercent: 12,
    pfEmployerContribution: 12,
    pfCeiling: 15000,
    
    esiEnabled: true,
    esiPercent: 0.75,
    esiEmployerPercent: 3.25,
    esiCeiling: 21000,
    
    gratuityEnabled: true,
    gratuityYears: 5,
    
    professionalTaxEnabled: true,
    professionalTaxAmount: 200,
    
    tdsEnabled: true,
    
    // Bonus & Incentives
    bonusEnabled: true,
    bonusMonth: "March",
    performanceBonusEnabled: true,
    
    // Leave Encashment
    leaveEncashmentEnabled: true,
    maxEncashmentDays: 30,
    
    // Loan & Advance
    loanEnabled: true,
    maxLoanAmount: 100000,
    advanceEnabled: true,
    maxAdvanceAmount: 50000,
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // API call here
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Payroll Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure payroll cycles, salary structure, statutory compliances, and deductions
        </Typography>
      </Box>

      {/* Alert */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoOutlinedIcon />}>
        Changes to payroll settings will apply from the next payroll cycle. Current cycle will use existing settings.
      </Alert>

      <Grid container spacing={3}>
        {/* Payroll Cycle Configuration */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
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
                    label="Payroll Cycle"
                    value={settings.payrollCycle}
                    onChange={(e) => handleChange("payrollCycle", e.target.value)}
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
                    label="Payroll Start Day"
                    value={settings.payrollStartDay}
                    onChange={(e) => handleChange("payrollStartDay", e.target.value)}
                    inputProps={{ min: 1, max: 31 }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Payroll End Day"
                    value={settings.payrollEndDay}
                    onChange={(e) => handleChange("payrollEndDay", e.target.value)}
                    inputProps={{ min: 1, max: 31 }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Payment Date"
                    value={settings.paymentDate}
                    onChange={(e) => handleChange("paymentDate", e.target.value)}
                    inputProps={{ min: 1, max: 31 }}
                    helperText="Day of month for salary credit"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Working Days per Month"
                    value={settings.workingDays}
                    onChange={(e) => handleChange("workingDays", e.target.value)}
                    inputProps={{ min: 20, max: 31 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Salary Structure */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccountBalanceWalletIcon sx={{ mr: 1.5, color: 'success.main', fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Salary Structure
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
                    type="number"
                    value={settings.basicPercent}
                    onChange={(e) => handleChange("basicPercent", e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="House Rent Allowance (HRA)"
                    fullWidth
                    type="number"
                    value={settings.hraPercent}
                    onChange={(e) => handleChange("hraPercent", e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Other Allowances"
                    fullWidth
                    type="number"
                    value={settings.allowancePercent}
                    onChange={(e) => handleChange("allowancePercent", e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Total: {parseInt(settings.basicPercent) + parseInt(settings.hraPercent) + parseInt(settings.allowancePercent)}%
                      {(parseInt(settings.basicPercent) + parseInt(settings.hraPercent) + parseInt(settings.allowancePercent)) === 100 ? (
                        <Chip label="Valid" color="success" size="small" sx={{ ml: 2 }} icon={<CheckCircleIcon />} />
                      ) : (
                        <Chip label="Invalid" color="error" size="small" sx={{ ml: 2 }} icon={<CancelIcon />} />
                      )}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Overtime Configuration */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 1.5, color: 'warning.main', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Overtime Configuration
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.overtimeEnabled}
                    onChange={(e) => handleChange("overtimeEnabled", e.target.checked)}
                  />
                }
                label="Enable Overtime Calculation"
              />

              {settings.overtimeEnabled && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Overtime Rate Multiplier"
                    type="number"
                    fullWidth
                    value={settings.overtimeRate}
                    onChange={(e) => handleChange("overtimeRate", e.target.value)}
                    sx={{ mb: 2 }}
                    inputProps={{ step: 0.1, min: 1, max: 3 }}
                    helperText="e.g., 1.5 means 1.5x of hourly rate"
                  />
                  <TextField
                    select
                    fullWidth
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
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptLongIcon sx={{ mr: 1.5, color: 'info.main', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Bonus & Incentives
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.bonusEnabled}
                    onChange={(e) => handleChange("bonusEnabled", e.target.checked)}
                  />
                }
                label="Enable Annual Bonus"
              />

              {settings.bonusEnabled && (
                <TextField
                  select
                  fullWidth
                  label="Bonus Month"
                  value={settings.bonusMonth}
                  onChange={(e) => handleChange("bonusMonth", e.target.value)}
                  sx={{ mt: 2, mb: 2 }}
                >
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(month => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </TextField>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.performanceBonusEnabled}
                    onChange={(e) => handleChange("performanceBonusEnabled", e.target.checked)}
                  />
                }
                label="Enable Performance Bonus"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Statutory Deductions Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon sx={{ mr: 1.5, color: 'error.main', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Statutory Deductions & Compliance
            </Typography>
          </Box>
        </Grid>

        {/* Provident Fund (PF) */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, border: settings.pfEnabled ? '2px solid' : 'none', borderColor: 'success.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Provident Fund (PF)
                </Typography>
                <Chip 
                  label={settings.pfEnabled ? "Active" : "Inactive"} 
                  color={settings.pfEnabled ? "success" : "default"} 
                  size="small" 
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pfEnabled}
                    onChange={(e) => handleChange("pfEnabled", e.target.checked)}
                  />
                }
                label="Enable PF Deduction"
              />

              {settings.pfEnabled && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Employee Contribution"
                        type="number"
                        fullWidth
                        value={settings.pfPercent}
                        onChange={(e) => handleChange("pfPercent", e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Employer Contribution"
                        type="number"
                        fullWidth
                        value={settings.pfEmployerContribution}
                        onChange={(e) => handleChange("pfEmployerContribution", e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="PF Ceiling Amount"
                        type="number"
                        fullWidth
                        value={settings.pfCeiling}
                        onChange={(e) => handleChange("pfCeiling", e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        helperText="Maximum salary for PF calculation"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ESI */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, border: settings.esiEnabled ? '2px solid' : 'none', borderColor: 'info.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Employee State Insurance (ESI)
                </Typography>
                <Chip 
                  label={settings.esiEnabled ? "Active" : "Inactive"} 
                  color={settings.esiEnabled ? "info" : "default"} 
                  size="small" 
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.esiEnabled}
                    onChange={(e) => handleChange("esiEnabled", e.target.checked)}
                  />
                }
                label="Enable ESI Deduction"
              />

              {settings.esiEnabled && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Employee Contribution"
                        type="number"
                        fullWidth
                        value={settings.esiPercent}
                        onChange={(e) => handleChange("esiPercent", e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Employer Contribution"
                        type="number"
                        fullWidth
                        value={settings.esiEmployerPercent}
                        onChange={(e) => handleChange("esiEmployerPercent", e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="ESI Ceiling Amount"
                        type="number"
                        fullWidth
                        value={settings.esiCeiling}
                        onChange={(e) => handleChange("esiCeiling", e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        helperText="Maximum salary for ESI applicability"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Tax */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Professional Tax
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.professionalTaxEnabled}
                    onChange={(e) => handleChange("professionalTaxEnabled", e.target.checked)}
                  />
                }
                label="Enable Professional Tax"
              />

              {settings.professionalTaxEnabled && (
                <TextField
                  label="Monthly PT Amount"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={settings.professionalTaxAmount}
                  onChange={(e) => handleChange("professionalTaxAmount", e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* TDS */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Income Tax (TDS)
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.tdsEnabled}
                    onChange={(e) => handleChange("tdsEnabled", e.target.checked)}
                  />
                }
                label="Enable TDS Deduction"
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                TDS will be calculated based on employee's tax declaration and applicable tax slabs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gratuity */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Gratuity
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.gratuityEnabled}
                    onChange={(e) => handleChange("gratuityEnabled", e.target.checked)}
                  />
                }
                label="Enable Gratuity"
              />

              {settings.gratuityEnabled && (
                <TextField
                  label="Minimum Service Years"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={settings.gratuityYears}
                  onChange={(e) => handleChange("gratuityYears", e.target.value)}
                  helperText="Minimum years of service for gratuity eligibility"
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Encashment */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Leave Encashment
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.leaveEncashmentEnabled}
                    onChange={(e) => handleChange("leaveEncashmentEnabled", e.target.checked)}
                  />
                }
                label="Enable Leave Encashment"
              />

              {settings.leaveEncashmentEnabled && (
                <TextField
                  label="Maximum Encashment Days"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={settings.maxEncashmentDays}
                  onChange={(e) => handleChange("maxEncashmentDays", e.target.value)}
                  helperText="Maximum leave days that can be encashed per year"
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Loan Configuration */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Employee Loan
              </Typography>

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
                <TextField
                  label="Maximum Loan Amount"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={settings.maxLoanAmount}
                  onChange={(e) => handleChange("maxLoanAmount", e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Advance Salary */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Advance Salary
              </Typography>

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
                <TextField
                  label="Maximum Advance Amount"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={settings.maxAdvanceAmount}
                  onChange={(e) => handleChange("maxAdvanceAmount", e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" size="large">
          Reset to Default
        </Button>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Payroll Settings
        </Button>
      </Box>
    </Box>
  );
};

export default PayrollSettings;
