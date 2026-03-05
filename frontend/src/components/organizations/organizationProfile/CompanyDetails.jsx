import {Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

const industryOptions = [
    "Software",
    "IT Services",
    "Manufacturing",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "E-commerce",
    "Consulting",
    "Other",
  ];
  
const companySizeOptions = [
    "1-10",
    "11-50",
    "51-100",
    "101-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10000+",
];

const CompanyDetails = ({form, editMode, handleChange}) => {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Company Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Industry"
                select
                fullWidth
                value={form.industry}
                disabled={!editMode}
                onChange={(e) => handleChange("industry", e.target.value)}
              >
                {industryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Company Size"
                select
                fullWidth
                value={form.companySize}
                disabled={!editMode}
                onChange={(e) => handleChange("companySize", e.target.value)}
              >
                {companySizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option} employees
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Founded Year"
                fullWidth
                value={form.foundedYear}
                disabled={!editMode}
                onChange={(e) => handleChange("foundedYear", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Registration Number"
                fullWidth
                value={form.registrationNumber}
                disabled={!editMode}
                onChange={(e) => handleChange("registrationNumber", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Company Description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                disabled={!editMode}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  )
}

export default CompanyDetails;