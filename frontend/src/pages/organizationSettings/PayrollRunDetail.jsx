import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton,
  Tooltip, CircularProgress, Alert, Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import api from "../../services/api";

const statusColor = { COMPLETED: "success", PROCESSING: "warning", FAILED: "error", DRAFT: "default" };

const fmt = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount ?? 0);

const StatBox = ({ label, value, color }) => (
  <Box sx={{ textAlign: "center", px: 3, py: 1.5, bgcolor: "grey.50", borderRadius: 2, minWidth: 140 }}>
    <Typography variant="h6" fontWeight={700} color={color || "text.primary"}>{value}</Typography>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
  </Box>
);

const PayrollRunDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/payroll/run/${id}`);
        if (res?.data?.success) setRun(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.msg || "Failed to load payroll run");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>{error}</Alert>;
  }

  if (!run) return null;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Tooltip title="Back to Payroll Settings">
          <IconButton onClick={() => navigate("/org-settings/payroll")} size="small">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <ReceiptLongIcon sx={{ color: "warning.main", fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Payroll Run — {run.month}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Processed on {new Date(run.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
          </Typography>
        </Box>
        <Chip
          label={run.status}
          color={statusColor[run.status] || "default"}
          size="small"
          sx={{ ml: 1, fontWeight: 700 }}
        />
      </Box>

      {/* Summary stats */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <StatBox label="Employees" value={run.totalEmployees} />
        <StatBox label="Total Gross" value={fmt(run.totalGross)} />
        <StatBox label="Total Deductions" value={fmt(run.totalDeductions)} color="error.main" />
        <StatBox label="Net Payout" value={fmt(run.totalNet)} color="success.main" />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Per-employee table */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
        Employee Breakdown
      </Typography>

      <TableContainer sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Gross</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Basic</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>HRA</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>PF (Emp)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ESI (Emp)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Prof. Tax</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>TDS</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "success.main" }}>Net Pay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {run.entries.map((entry) => (
              <TableRow key={entry.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{entry.employeeName}</TableCell>
                <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>{entry.designation}</TableCell>
                <TableCell>{fmt(entry.grossSalary)}</TableCell>
                <TableCell>{fmt(entry.basic)}</TableCell>
                <TableCell>{fmt(entry.hra)}</TableCell>
                <TableCell sx={{ color: "error.main" }}>{fmt(entry.pfEmployee)}</TableCell>
                <TableCell sx={{ color: "error.main" }}>{fmt(entry.esiEmployee)}</TableCell>
                <TableCell sx={{ color: "error.main" }}>{fmt(entry.professionalTax)}</TableCell>
                <TableCell sx={{ color: "error.main" }}>{fmt(entry.tds)}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "success.main" }}>{fmt(entry.netPay)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PayrollRunDetail;
