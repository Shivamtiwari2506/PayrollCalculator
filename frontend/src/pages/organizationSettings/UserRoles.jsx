import { useMemo, useState } from 'react';
import {useDispatch} from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import { ROLES } from '../../utils/commonFunctions/helpers';
import EmployeeStatsCards from '../../components/organizations/userRoles/EmployeeStatsCards';
import PeopleIcon from '@mui/icons-material/People';
import EmployeeFilters from '../../components/organizations/userRoles/EmployeeFilters';
import EmployeeTable from '../../components/organizations/userRoles/EmployeeTable';
import EmployeeFormDialog from '../../components/organizations/userRoles/EmployeeFormDialog';
import { handleApiError } from '../../utils/commonFunctions/errorHandler';
import api from '../../services/api';
import { useEffect } from 'react';
import Loader from '../../utils/Loader';
import { toast } from 'react-toastify';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import { getCurrentUser } from '../../redux/actions/userActions';
import { getOrgData } from '../../redux/actions/orgActions';

const roleOptions = ROLES ? Object.values(ROLES) : [];
const defaultForm = {
  name: '',
  email: '',
  role: 'User',
  active: false,
  designation: '',
  dateOfJoining: '',
  ctc: null,
}
const UserRoles = () => {
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [form, setForm] = useState(defaultForm);

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
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newThisMonth = employees.filter(
      emp => emp.dateOfJoining && new Date(emp.dateOfJoining) >= startOfMonth
    ).length;

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

  const updateEmployee = async() => {
    setFormLoading(true);
    try {
      const response = await api.put(`/employees/update`, {
        ...form,
        id: editing.id
      });
      if(response?.data && response?.data.success === true) {
        toast.success(response?.data?.message || 'employee updated successfully');
        dispatch(getCurrentUser());
        dispatch(getOrgData());
        getEmployees();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setFormLoading(false);
      setOpen(false);
    }
  }

  const deleteEmployee = async() => {
    setFormLoading(true);
    try {
      const response = await api.delete(`/employees/${editing.id}`);
      if(response?.data && response?.data.success === true) {
        toast.success(response?.data?.message || 'employee deleted successfully');
        getEmployees();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setFormLoading(false);
      setEditing(null);
      setOpenDelete(false);
    }
  }

  // Handlers
  const handleOpenAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm(emp);
    setOpen(true);
  };

  const handleDelete = async (emp) => {
    setOpenDelete(true);
    setEditing(emp);
  };

  const handleSubmit = () => {
    if (editing) {
      updateEmployee();
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <PeopleIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Employees & Roles
          </Typography>
        </Box>
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

      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => {setOpenDelete(false); setEditing(null)}}
        onConfirm={deleteEmployee}
        loading={formLoading}
        itemName={editing?.name}
      />
    </Box>
  );
};

export default UserRoles;