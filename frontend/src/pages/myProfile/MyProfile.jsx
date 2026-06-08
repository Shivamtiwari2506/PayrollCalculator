import { Box, Typography } from '@mui/material'
import React from 'react'

const MyProfile = () => {
  return (
    <div>
      <Box>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1">
          This is the My Profile page. Here you can view and edit your profile information.
        </Typography>
      </Box>
    </div>
  )
}

export default MyProfile
