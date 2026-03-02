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
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
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
            <TableCell><b>Status</b></TableCell>
            <TableCell align="right"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredEmployees
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((emp) => (
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
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />
    </Paper>
  );
};

export default EmployeeTable;
