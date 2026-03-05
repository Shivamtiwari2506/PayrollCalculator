import {Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const BankInfo = ({form, editMode, handleChange}) => {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            <AccountBalanceIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Banking Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Bank Name"
                fullWidth
                value={form.bankName}
                disabled={!editMode}
                onChange={(e) => handleChange("bankName", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Account Number"
                fullWidth
                value={form.accountNumber}
                disabled={!editMode}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="IFSC Code"
                fullWidth
                value={form.ifscCode}
                disabled={!editMode}
                onChange={(e) => handleChange("ifscCode", e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  )
}

export default BankInfo