import { Avatar, Box, Card, CardContent, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import CloseIcon from "@mui/icons-material/Close";

const BasicInfo = ({ form, editMode, handleChange }) => {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 1 }}>
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Logo */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  "&:hover .delete-icon": {
                    opacity: 1,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 140,
                    height: 140,
                    border: "4px solid",
                    borderColor: "primary.main",
                    boxShadow: 3,
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2, // spacing so logo doesn't touch border
                    }}
                  >
                    {form.logo ? (
                      <Box
                        component="img"
                        src={form.logo}
                        alt="Company Logo"
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <BusinessIcon sx={{ fontSize: 60 }} />
                    )}
                  </Box>
                </Avatar>

                {/* Upload Icon */}
                {editMode && (
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    <PhotoCameraIcon />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChange("logo", e.target.files[0])}
                    />
                  </IconButton>
                )}

                {/* Delete Icon */}
                {editMode && form.logo !== '' && (
                  <IconButton
                    className="delete-icon"
                    onClick={() => handleChange("logo", "remove")}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "info.main",
                      color: "white",
                      opacity: 0,
                      transition: "0.2s",
                      "&:hover": {
                        backgroundColor: "info.dark",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              {editMode && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
                  Upload company logo (Max 1MB)
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Organization Name"
                  fullWidth
                  value={form.orgName}
                  disabled={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email Address"
                  fullWidth
                  type="email"
                  value={form.email}
                  disabled={true}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={form.phone}
                  disabled={!editMode}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 10
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Website"
                  fullWidth
                  value={form.website}
                  disabled={!editMode}
                  onChange={(e) => handleChange("website", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BasicInfo