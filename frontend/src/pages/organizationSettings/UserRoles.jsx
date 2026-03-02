import React, { useMemo, useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  TablePagination,
  Switch,
  Tooltip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ROLES from '../../utils/roles';

const roleOptions = ROLES ? Object.values(ROLES) : [];

const dummyEmployees = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@company.com',
    role: 'User',
    active: true,
  },
  {
    id: 2,
    name: 'Priya Verma',
    email: 'priya@company.com',
    role: 'Org_Admin',
    active: true,
  },
];

const getRoleColor = (role) => {
  if (role === 'Admin') return 'error';
  if (role === 'Org_Admin') return 'warning';
  return 'primary';
};

const UserRoles = () => {
  const [employees, setEmployees] = useState(dummyEmployees);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'User',
    active: true,
  });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ filtered data
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        roleFilter === 'All' || emp.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [employees, search, roleFilter]);

  // ================= handlers =================

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'User', active: true });
    setOpen(true);
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm(emp);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;

    if (editing) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...form } : e))
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }

    setOpen(false);
  };

  const handleStatusToggle = (id) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, active: !e.active } : e
      )
    );
  };

  // ================= UI =================

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Employees & User Roles
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius:  0.5 }}
        >
          Add Employee
        </Button>
      </Box>

      {/* FILTER BAR */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius:  0.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {roleOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* TABLE */}
      <Paper elevation={3} sx={{ borderRadius:  0.5}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>

                  <TableCell>
                    <Chip
                      label={emp.role}
                      color={getRoleColor(emp.role)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={emp.active}
                      onChange={() => handleStatusToggle(emp.id)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(emp)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>

      {/* ADD / EDIT MODAL */}
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
    </Box>
  );
};

export default UserRoles;