import { Grid, Card, CardContent, Typography, TextField, Switch, FormControlLabel, Box, InputAdornment, Chip, MenuItem } from "@mui/material";

const StatutoryDeductions = ({ settings, handleChange }) => {
  return (
    <Grid container spacing={3}>
      {/* Provident Fund (PF) */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1, border: settings.pfEnabled ? '2px solid' : 'none', borderColor: 'success.main' }}>
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
                      onChange={(e) => handleChange("pfPercent", parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ step: 0.1, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Employer Contribution"
                      type="number"
                      fullWidth
                      value={settings.pfEmployerContribution}
                      onChange={(e) => handleChange("pfEmployerContribution", parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ step: 0.1, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="PF Calculation Base"
                      fullWidth
                      value={settings.pfCeiling}
                      onChange={(e) => handleChange("pfCeiling", e.target.value)}
                      helperText="Choose how PF should be calculated"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    >
                      <MenuItem value={15000}>15,000 (PF Ceiling Limit)</MenuItem>
                      <MenuItem value="basic">Basic Salary (Full PF)</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* ESI */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1, border: settings.esiEnabled ? '2px solid' : 'none', borderColor: 'info.main' }}>
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
                      onChange={(e) => handleChange("esiPercent", parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ step: 0.01, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Employer Contribution"
                      type="number"
                      fullWidth
                      value={settings.esiEmployerPercent}
                      onChange={(e) => handleChange("esiEmployerPercent", parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ step: 0.01, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="ESI Ceiling Amount"
                      type="number"
                      fullWidth
                      value={settings.esiCeiling}
                      onChange={(e) => handleChange("esiCeiling", parseInt(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      helperText="Maximum gross salary eligible for ESI (Currently ₹21,000 as per ESIC rules)"
                      inputProps={{min: 0}}
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
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Professional Tax
              </Typography>
              <Chip 
                label={settings.professionalTaxEnabled ? "Active" : "Inactive"} 
                color={settings.professionalTaxEnabled ? "info" : "default"} 
                size="small" 
              />
            </Box>

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
                onChange={(e) => handleChange("professionalTaxAmount", parseInt(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                helperText="Professional Tax amount varies by state and salary slab (e.g., up to ₹200/month in many states)"
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* TDS */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Income Tax (TDS)
              </Typography>
              <Chip 
                label={settings.tdsEnabled ? "Active" : "Inactive"} 
                color={settings.tdsEnabled ? "info" : "default"} 
                size="small" 
              />
            </Box>

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
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Gratuity
              </Typography>
              <Chip 
                label={settings.gratuityEnabled ? "Active" : "Inactive"} 
                color={settings.gratuityEnabled ? "info" : "default"} 
                size="small"
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.gratuityEnabled}
                  onChange={(e) => handleChange("gratuityEnabled", e.target.checked)}
                />
              }
              label={<Typography variant="body2">Enable Gratuity Deduction <i>(4.8% of basic salary)</i></Typography>}
            />

            {settings.gratuityEnabled && (
              <TextField
                label="Minimum Service Years"
                type="number"
                fullWidth
                sx={{ mt: 2 }}
                value={settings.gratuityYears}
                onChange={(e) => handleChange("gratuityYears", parseInt(e.target.value))}
                helperText="Minimum years of service for gratuity eligibility"
                inputProps={{ min: 1, max: 10 }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Leave Encashment */}
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Leave Encashment
              </Typography>
              <Chip 
                label={settings.leaveEncashmentEnabled ? "Active" : "Inactive"} 
                color={settings.leaveEncashmentEnabled ? "info" : "default"} 
                size="small" 
              />
            </Box>

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
                onChange={(e) => handleChange("maxEncashmentDays", parseInt(e.target.value))}
                helperText="Maximum leave days that can be encashed per year"
                inputProps={{ min: 1, max: 365 }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatutoryDeductions;
