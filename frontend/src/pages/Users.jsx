import { Typography, Paper } from '@mui/material';

export default function Users() {
  return (
    <Paper elevation={3} className="p-8">
      <Typography variant="h4" className="mb-6">Users</Typography>
      <Typography>User management page</Typography>
    </Paper>
  );
}
