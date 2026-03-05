import {Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';


const AddressInfo = ({form, editMode, handleChange}) => {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Address Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Registered Address"
                fullWidth
                value={form.address}
                disabled={!editMode}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                fullWidth
                value={form.city}
                disabled={!editMode}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="State"
                fullWidth
                value={form.state}
                disabled={!editMode}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Pincode"
                fullWidth
                value={form.pincode}
                disabled={!editMode}
                onChange={(e) => handleChange("pincode", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Country"
                fullWidth
                value={form.country}
                disabled={!editMode}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  )
}

export default AddressInfo