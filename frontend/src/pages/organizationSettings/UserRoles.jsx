import { useMemo, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { ROLES } from '../../utils/commonFunctions/helpers';
import EmployeeStatsCards from '../../components/organizations/EmployeeStatsCards';
import EmployeeFilters from '../../components/organizations/EmployeeFilters';
import EmployeeTable from '../../components/organizations/EmployeeTable';
import EmployeeFormDialog from '../../components/organizations/EmployeeFormDialog';

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

  // Filtered data
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

  // Stats Calculation
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.active).length;
    const adminCount = employees.filter(emp => emp.role === 'Admin' || emp.role === 'Org_Admin').length;
    const newThisMonth = employees.filter(emp => {
      return emp.id > 1000;
    }).length;

    return {
      total: totalEmployees,
      active: activeEmployees,
      admins: adminCount,
      newThisMonth: newThisMonth,
    };
  }, [employees]);

  // Handlers
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

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Employees & Roles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your employees and their roles
          </Typography>
        </Box>

      </Box>

      {/* STATS CARDS */}
      <EmployeeStatsCards stats={stats} />

      {/* FILTER BAR */}
      <EmployeeFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        roleOptions={roleOptions}
        handleOpenAdd={handleOpenAdd}
      />

      {/* TABLE */}
      <EmployeeTable
        filteredEmployees={filteredEmployees}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleStatusToggle={handleStatusToggle}
      />

      {/* ADD / EDIT MODAL */}
      <EmployeeFormDialog
        open={open}
        setOpen={setOpen}
        editing={editing}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        roleOptions={roleOptions}
      />
    </Box>
  );
};

export default UserRoles;