import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';

const EmployeeFormDialog = ({
  open,
  setOpen,
  editing,
  form,
  setForm,
  handleSubmit,
  roleOptions,
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>
        {editing ? 'Edit Employee' : 'Add Employee'}
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Employee Name"
          sx={{ mt: 2 }}
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="Email"
          sx={{ mt: 2 }}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <TextField
          select
          fullWidth
          label="Role"
          sx={{ mt: 2 }}
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          {roleOptions.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editing ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormDialog;
