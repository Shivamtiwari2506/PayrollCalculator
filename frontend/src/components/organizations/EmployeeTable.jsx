import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Avatar,
  Box,
  Typography,
  Chip,
  Switch,
  Tooltip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInitials } from '../../utils/commonFunctions/helpers';

const getRoleColor = (role) => {
  if (role === 'Admin') return 'error';
  if (role === 'Org_Admin') return 'warning';
  return 'primary';
};

const EmployeeTable = ({
  filteredEmployees,
  pagination,
  setPagination,
  handleEdit,
  handleDelete,
  handleStatusToggle,
}) => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 0.5 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Employee</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>Role</b></TableCell>
            <TableCell><b>Designation</b></TableCell>
            <TableCell><b>Date of Joining</b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredEmployees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', fontSize: 16 }}>
                      {getInitials(emp)}
                    </Avatar>
                    <Typography>{emp.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{emp.email}</TableCell>

                <TableCell>
                  <Chip
                    label={emp.role}
                    color={getRoleColor(emp.role)}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={emp.designation}
                    color={"secondary"}
                    size="small"
                  />
                </TableCell>

                <TableCell>{emp.dateOfJoining}</TableCell>

                <TableCell align="center">
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
        count={pagination.total}
        page={pagination.page-1}
        onPageChange={(_, newPage) => setPagination({ ...pagination, page: newPage + 1 })}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={(e) =>
          setPagination({ ...pagination, page: 1, limit: parseInt(e.target.value, 10) })
        }
        rowsPerPageOptions={[10, 20, 50, 100]}
        hidden={filteredEmployees.length<=0}
      />
    </Paper>
  );
};

export default EmployeeTable;
