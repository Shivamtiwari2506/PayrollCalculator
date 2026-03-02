import React from 'react'
import { Typography, Paper } from '@mui/material';
const Profile = () => {
  return (
    <Paper elevation={3} className="p-8">
      <Typography variant="h4" className="mb-6">Organization Profile</Typography>
      <Typography>Welcome to your organization profile page!</Typography>
    </Paper>
  )
}

export default Profile
