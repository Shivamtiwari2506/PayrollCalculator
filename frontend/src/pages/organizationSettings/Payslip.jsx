import React from 'react'
import { Typography, Paper } from '@mui/material';
const Payslip = () => {
  return (
    <Paper elevation={3} className="p-8">
      <Typography variant="h4" className="mb-6">Payslip</Typography>
      <Typography>Welcome to your payslip page!</Typography>
    </Paper>
  )
}

export default Payslip
