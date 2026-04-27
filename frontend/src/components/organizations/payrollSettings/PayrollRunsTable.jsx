import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip,
  IconButton, Tooltip, CircularProgress, Alert,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";

const statusColor = {
  COMPLETED: "success",
  PROCESSING: "warning",
  FAILED: "error",
  DRAFT: "default",
};

const fmt = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const PayrollRunsTable = ({ runs, loading, error }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <ReceiptIcon sx={{ color: "primary.main", fontSize: 22 }} />
        <Typography variant="h6" fontWeight={700}>
          Payroll Run History
        </Typography>
        {runs.length > 0 && (
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            ({runs.length})
          </Typography>
        )}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      )}

      {!loading && !error && runs.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <Typography variant="body2">No payroll runs yet. Click "Run Payroll" to process your first payroll.</Typography>
        </Box>
      )}

      {!loading && !error && runs.length > 0 && (
        <TableContainer sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Employees</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Gross</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Deductions</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Net Payout</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Run Date</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{run.month}</TableCell>
                  <TableCell>{run.totalEmployees}</TableCell>
                  <TableCell>{fmt(run.totalGross)}</TableCell>
                  <TableCell sx={{ color: "error.main" }}>{fmt(run.totalDeductions)}</TableCell>
                  <TableCell sx={{ color: "success.main", fontWeight: 600 }}>{fmt(run.totalNet)}</TableCell>
                  <TableCell>
                    <Chip
                      label={run.status}
                      color={statusColor[run.status] || "default"}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>
                    {new Date(run.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View breakdown">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/org-settings/payroll/run/${run.id}`)}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PayrollRunsTable;
