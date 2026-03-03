import { useMemo, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { ROLES } from '../../utils/commonFunctions/helpers';
import EmployeeStatsCards from '../../components/organizations/EmployeeStatsCards';
import EmployeeFilters from '../../components/organizations/EmployeeFilters';
import EmployeeTable from '../../components/organizations/EmployeeTable';
import EmployeeFormDialog from '../../components/organizations/EmployeeFormDialog';
import { handleApiError } from '../../utils/commonFunctions/errorHandler';
import api from '../../services/api';
import { useEffect } from 'react';
import Loader from '../../utils/Loader';
import { toast } from 'react-toastify';

const roleOptions = ROLES ? Object.values(ROLES) : [];

const UserRoles = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'User',
    active: true,
    designation: '',
    dateOfJoining: '',
  });

  const [search, setSearch] = useState('');
  const [designationFilter, setDesignationFilter] = useState('All');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  // Filtered data
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

      return matchSearch;
    });
  }, [employees, search]);

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

  const getEmployees = async() => {
    setLoading(true);
      try {
        const response = await api.get('/employees', {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            designation: designationFilter === 'All' ? '' : designationFilter
          }
        });
        if(response?.data && response?.data?.success === true) {
          setEmployees(response?.data?.data);
          setPagination(response?.data?.pagination);
          let allDesignation = response?.data?.designations.map((d) => d.designation);
          setDesignations(allDesignation);
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
  };

  const addEmployee = async() => {
    setFormLoading(true);
    try {
      const response = await api.post('/employees', form);
      if(response?.data && response?.data.success === true) {
        toast.success(response?.data?.message || 'employee added successfully');
        getEmployees();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setFormLoading(false);
      setOpen(false);
    }
  }

  // Handlers
  const handleOpenAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'User', active: true, designation: '', dateOfJoining: '' });
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
      addEmployee();
    }
  };

  const handleStatusToggle = (id) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, active: !e.active } : e
      )
    );
  };

  useEffect(() => {
    getEmployees();
  }, [pagination.page, pagination.limit, designationFilter]);

  if(loading === true) {
    return <Loader />
  }

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
        designationFilter={designationFilter}
        setDesignationFilter={setDesignationFilter}
        designations={designations}
        handleOpenAdd={handleOpenAdd}
      />

      {/* TABLE */}
      <EmployeeTable
        filteredEmployees={filteredEmployees}
        pagination={pagination}
        setPagination={setPagination}
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
        formLoading={formLoading}
      />
    </Box>
  );
};

export default UserRoles;