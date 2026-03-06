import { Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import PolicyIcon from '@mui/icons-material/Policy';

const TaxLegalInfo = ({ form, editMode, handleChange }) => {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 1 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          <PolicyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Tax & Legal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="PAN Number"
              fullWidth
              value={form.pan}
              disabled={!editMode}
              onChange={(e) => handleChange("pan", e.target.value)}
              inputProps={{
                maxLength: 10,
                style: { textTransform: 'uppercase' },
                inputMode: 'text',
                pattern: '[A-Z0-9]{10}',
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="GSTIN"
              fullWidth
              value={form.gst}
              disabled={!editMode}
              onChange={(e) => handleChange("gst", e.target.value)}
              inputProps={{
                maxLength: 15,
                style: { textTransform: 'uppercase' },
                inputMode: 'text',
                pattern: '[0-9]{2}[A-Z0-9]{11}Z[0-9A-Z]',
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Tax ID"
              fullWidth
              value={form.taxId}
              disabled={!editMode}
              onChange={(e) => handleChange("taxId", e.target.value)}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TaxLegalInfo