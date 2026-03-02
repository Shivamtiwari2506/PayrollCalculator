import { Typography, Paper } from '@mui/material';

export default function Dashboard() {

  return (
    <Paper elevation={3} className="p-8">
      <Typography variant="h4" className="mb-6">Dashboard</Typography>
      <Typography>Welcome to your dashboard!</Typography>
    </Paper>
  );
}
