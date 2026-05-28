import { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Button, Avatar, Grid, Paper,
  CircularProgress, Alert, MenuItem, Select,
  FormControl, InputLabel,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { useTheme } from "@mui/material/styles";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import api from "../../services/api";
import { formatIndianRuppee } from "../../utils/commonFunctions/helpers";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PayslipPDF from "../../components/organizations/payrollSettings/PayslipPDF";
import Loader from "../../utils/Loader";
import NoDataFound from "../../components/ui/NoDataFound";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = formatIndianRuppee;

const displayMonth = (m) => {

  if (!m) return "";

  const [year, month] = m.split("-");

  return new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleString("en-IN", {
    month: "long",
    year: "numeric"
  });
};

// ─── Month Picker ────────────────────────────────────────────────────────────

const MonthPicker = ({ months, selected, onSelect, loading, error }) => (
  <Box
    sx={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 320, gap: 3,
    }}
  >
    <ReceiptLongIcon sx={{ fontSize: 56, color: "warning.main", opacity: 0.8 }} />
    <Typography variant="h5" fontWeight={700}>Select Payslip Month</Typography>
    <Typography variant="body2" color="text.secondary">
      Choose the date for which you want to view your payslip
    </Typography>

    {loading && <Loader fullScreen={false} height={"30vh"}/>}
    {!loading && error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

    {!loading && !error && months.length === 0 && (
      <NoDataFound className="h-60" message="No payslips available yet"
        description="Your payslip will appear here once payroll is processed."/>
    )}

    {!loading && !error && months.length > 0 && (
      <FormControl sx={{ minWidth: 260 }}>
        <InputLabel>Month</InputLabel>
        <Select
          value={selected?.id || ""}
          label="Month"
          onChange={(e) => {

            const selectedItem = months.find(
              (m) => m.id === e.target.value
            );

            onSelect(selectedItem);
          }}
        >
          {months.map((m, index) => (

            <MenuItem
              key={m.id || index}
              value={m.id}
            >

              {m.type === "monthly"
                ? displayMonth(m.month)
                : `${new Date(m.startDate).toLocaleDateString("en-IN")} - ${new Date(m.endDate).toLocaleDateString("en-IN")}`
              }

            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  </Box>
);

// ─── Payslip View ────────────────────────────────────────────────────────────

const PayslipView = ({ data, month, onChangeMonth, org, printRef }) => {
  const theme = useTheme();
  const bd = data.breakdown || {};

  const earnings = [
    { label: "Basic Salary", amount: data.basic },
    { label: "HRA", amount: data.hra },
    { label: "Allowance", amount: data.allowance },
    ...(data.overtimeAmount > 0 ? [{ label: "Overtime", amount: data.overtimeAmount }] : []),
    ...(data.bonusAmount > 0 ? [{ label: "Bonus", amount: data.bonusAmount }] : []),
  ];

  const deductions = [
    ...(data.pfEmployee > 0 ? [{ label: "PF (Employee)", amount: data.pfEmployee }] : []),
    ...(data.esiEmployee > 0 ? [{ label: "ESI (Employee)", amount: data.esiEmployee }] : []),
    ...(data.professionalTax > 0 ? [{ label: "Professional Tax", amount: data.professionalTax }] : []),
    ...(data.tds > 0 ? [{ label: "TDS", amount: data.tds }] : []),
    ...(data.loanDeduction > 0 ? [{ label: "Loan Deduction", amount: data.loanDeduction }] : []),
    ...(data.advanceDeduction > 0 ? [{ label: "Advance Deduction", amount: data.advanceDeduction }] : []),
  ];

  return (
    <Box ref={printRef}>
      {/* Title row */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Box>
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            {displayMonth(month)} Payslip
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Processed on {new Date(data.processedOn).toLocaleDateString("en-IN", { dateStyle: "long" })}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}
            sx={{ textTransform: "none" }}>
            Print
          </Button>
          <PDFDownloadLink
            document={<PayslipPDF payslip={{ ...data, month }} org={org} />}
            fileName={`Payslip_${data.employeeName?.replace(/\s+/g, "_")}_${month}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <DownloadIcon />}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                {loading ? "Preparing..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
          <Button variant="text" onClick={onChangeMonth} sx={{ textTransform: "none" }}>
            Change Month
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} alignItems="stretch">

        {/* Employee info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: 22 }}>
                {data.employeeName?.[0] ?? "?"}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{data.employeeName}</Typography>
                <Typography variant="body2" color="text.secondary">{data.designation}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Row label="Annual CTC" value={fmt(data.ctc)} />
              <Row label="Monthly Gross" value={fmt(data.grossSalary)} />
              <Row label="Month" value={displayMonth(month)} />
            </Box>
          </Paper>
        </Grid>

        {/* Net pay hero */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 2, bgcolor: "primary.main", color: "white", height: "100%" }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>Net Pay</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 0.5 }}>
              {fmt(data.netPay)}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>Gross Earnings</Typography>
                <Typography fontWeight={700}>{fmt(data.grossSalary)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>Total Deductions</Typography>
                <Typography fontWeight={700}>{fmt(data.totalDeductions)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>Employer PF</Typography>
                <Typography fontWeight={700}>{fmt(data.pfEmployer)}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Earnings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Earnings</Typography>
            {earnings.map((item) => (
              <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", py: 1.2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="body2">{item.label}</Typography>
                <Typography variant="body2" fontWeight={600}>{fmt(item.amount)}</Typography>
              </Box>
            ))}
            <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1.5 }}>
              <Typography fontWeight={700}>Total Gross</Typography>
              <Typography fontWeight={700} color="success.main">{fmt(data.grossSalary)}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Deductions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Deductions</Typography>
            {deductions.length === 0 && (
              <Typography variant="body2" color="text.secondary">No deductions this month.</Typography>
            )}
            {deductions.map((item) => (
              <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", py: 1.2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="body2">{item.label}</Typography>
                <Typography variant="body2" fontWeight={600} color="error.main">{fmt(item.amount)}</Typography>
              </Box>
            ))}
            <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1.5 }}>
              <Typography fontWeight={700}>Total Deductions</Typography>
              <Typography fontWeight={700} color="error.main">{fmt(data.totalDeductions)}</Typography>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

const Row = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={600}>{value}</Typography>
  </Box>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const Payslip = () => {
  const printRef = useRef();

  const [org, setOrg] = useState(null);
  const [months, setMonths] = useState([]);
  const [monthsLoading, setMonthsLoading] = useState(true);
  const [monthsError, setMonthsError] = useState("");

  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [payslip, setPayslip] = useState(null);
  const [payslipLoading, setPayslipLoading] = useState(false);
  const [payslipError, setPayslipError] = useState("");

  // Fetch org profile (for logo + address in PDF) and available months on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [monthsRes, orgRes] = await Promise.all([
          api.get("/payroll/payslip/months"),
          api.get("/org/profile"),
        ]);
        if (monthsRes?.data?.success) setMonths(monthsRes.data.data);
        if (orgRes?.data?.success) setOrg(orgRes.data.data);
      } catch {
        setMonthsError("Failed to load payslip data.");
      } finally {
        setMonthsLoading(false);
      }
    };
    load();
  }, []);

  // Fetch payslip when a month is selected
  useEffect(() => {

    if (!selectedPayroll) return;

    const load = async () => {

      setPayslipLoading(true);
      setPayslipError("");
      setPayslip(null);

      try {

        let url = "/payroll/payslip?";

        // Monthly
        if (selectedPayroll.type === "monthly") {

          url += `month=${selectedPayroll.month}`;

        }

        // Weekly/Biweekly
        else {

          url +=
            `startDate=${selectedPayroll.startDate}` +
            `&endDate=${selectedPayroll.endDate}`;
        }

        const res = await api.get(url);

        if (res?.data?.success) {

          setPayslip(res.data.data);
        }

      } catch (err) {

        setPayslipError(
          err?.response?.data?.msg ||
          "Failed to load payslip."
        );

      } finally {

        setPayslipLoading(false);
      }
    };

    load();

  }, [selectedPayroll]);

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          <ReceiptLongIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>Payslip</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          View and download your monthly, weekly, or biweekly payslips
        </Typography>
      </Box>

      <Box sx={{ p: 3, borderRadius: 1, bgcolor: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>

        {/* No month selected yet — show picker */}
        {!selectedPayroll && (
          <MonthPicker
            months={months}
            selected={selectedPayroll}
            onSelect={setSelectedPayroll}
            loading={monthsLoading}
            error={monthsError}
          />
        )}

        {/* Month selected — loading payslip */}
        {selectedPayroll && payslipLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <Loader  />
          </Box>
        )}

        {/* Month selected — error */}
        {selectedPayroll && !payslipLoading && payslipError && (
          <Box sx={{ py: 4 }}>
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>{payslipError}</Alert>
            <Button variant="text" onClick={() => { setSelectedPayroll(null); setPayslipError(""); }}>
              ← Back to month selection
            </Button>
          </Box>
        )}

        {/* Payslip loaded */}
        {selectedPayroll && !payslipLoading && payslip && (
          <PayslipView
            data={payslip}
            month={
              selectedPayroll?.type === "monthly"
                ? selectedPayroll.month
                : `${new Date(selectedPayroll.startDate).toLocaleDateString("en-IN")} - ${new Date(selectedPayroll.endDate).toLocaleDateString("en-IN")}`
            }
            onChangeMonth={() => { setSelectedPayroll(null); setPayslip(null); }}
            org={org}
            printRef={printRef}
          />
        )}

      </Box>
    </Box>
  );
};

export default Payslip;
