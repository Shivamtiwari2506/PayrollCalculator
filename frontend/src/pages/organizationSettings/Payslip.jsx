import React from "react";
import {
  Paper,
  Typography,
  Button,
  Avatar,
  Box,
  Grid,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Payslip = () => {
  const theme = useTheme();
  const employee = {
    name: "Alexander Thorne",
    role: "Senior Product Architect",
    employeeId: "SL-99402-B",
    department: "Core Infrastructure",
    bank: "Chase Bank •••• 8820",
    netSalary: "₹84,520",
    gross: "₹1,12,000",
    deductions: "₹27,480",
    ytd: "₹10,24,000",
  };

  const earnings = [
    { label: "Base Salary", amount: "₹95,000" },
    { label: "Seniority Bonus", amount: "₹12,000" },
    { label: "Remote Allowance", amount: "₹5,000" },
  ];

  const deductions = [
    { label: "Income Tax", amount: "₹15,000" },
    { label: "PF Contribution", amount: "₹7,000" },
    { label: "Insurance", amount: "₹5,480" },
  ];

  const chartData = [
    { month: "Apr", salary: 7900 },
    { month: "May", salary: 8100 },
    { month: "Jun", salary: 8050 },
    { month: "Jul", salary: 8800 },
    { month: "Aug", salary: 8650 },
    { month: "Sep", salary: 8452 },
  ];

  return (
    <Box>
        <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ReceiptLongIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Payslip
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Get your monthly payslip
        </Typography>
      </Box>

      <Box sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 , justifyContent: "space-between" }} >
          <Box>
            <Typography variant="h4" color={'primary.main'} className="font-bold">
              September 2023 Payslip
            </Typography>
            <Typography variant="body2" color={'secondary.main'} className="font-bold">
              Payment Date: September 28, 2023
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Download
            </Button>
            <Button variant="outlined" startIcon={<PrintIcon />}>
              Print
            </Button>
            <Button variant="outlined">
              <ShareIcon />
            </Button>
          </Box>
        </Box>

        {/* Grid Layout */}
        <Grid container spacing={3} alignItems="stretch">

          {/* Employee Card */}
          <Grid item xs={12} md={4}>
            <Paper className="p-6 rounded-xl shadow-sm h-full">
              <div className="flex items-center gap-4 mb-6">
                <Avatar sx={{ width: 60, height: 60 }}>
                  {employee.name[0]}
                </Avatar>
                <div>
                  <Typography variant="h6" className="font-bold">
                    {employee.name}
                  </Typography>
                  <Typography className="text-gray-500 text-sm">
                    {employee.role}
                  </Typography>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Employee ID</span>
                  <span>{employee.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Department</span>
                  <span>{employee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank</span>
                  <span>{employee.bank}</span>
                </div>
              </div>
            </Paper>
          </Grid>

          {/* Salary Hero Card */}
          <Grid item xs={12} md={8}>
            <Paper
              // sx={{ bgcolor: "primary.light" }}
              className="p-8 rounded-xl shadow-sm text-white h-full"
            >
              <Typography className="text-sm opacity-80">
                Total Net Salary
              </Typography>

              <Typography variant="h3" className="font-bold mt-2">
                {employee.netSalary}
              </Typography>

              <Grid container spacing={2} className="mt-6">
                <Grid item xs={4}>
                  <p className="text-xs opacity-80">Gross Earnings</p>
                  <p className="font-bold mt-1">{employee.gross}</p>
                </Grid>
                <Grid item xs={4}>
                  <p className="text-xs opacity-80">Deductions</p>
                  <p className="font-bold mt-1">{employee.deductions}</p>
                </Grid>
                <Grid item xs={4}>
                  <p className="text-xs opacity-80">YTD Earnings</p>
                  <p className="font-bold mt-1">{employee.ytd}</p>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Earnings Card */}
          <Grid item xs={12} md={6}>
            <Paper className="p-6 rounded-xl shadow-sm h-full">
              <Typography variant="h6" className="font-bold mb-4">
                Earnings Breakdown
              </Typography>

              {earnings.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-3 border-b last:border-none"
                >
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.amount}</span>
                </div>
              ))}
            </Paper>
          </Grid>

          {/* Deductions Card */}
          <Grid item xs={12} md={6}>
            <Paper className="p-6 rounded-xl shadow-sm h-full">
              <Typography variant="h6" className="font-bold mb-4">
                Taxes & Contributions
              </Typography>

              {deductions.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-3 border-b last:border-none"
                >
                  <span>{item.label}</span>
                  <span className="font-semibold text-red-500">
                    {item.amount}
                  </span>
                </div>
              ))}
            </Paper>
          </Grid>

          {/* Recharts Section */}
          <Grid item xs={12}>
            <Paper className="p-6 rounded-xl shadow-sm">
              <Typography variant="h6" className="font-bold mb-4">
                Historical Pay Trend
              </Typography>

              <div className="w-full h-64">
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <Tooltip />
                    <Bar
                      fill={theme.palette.primary.main}
                      dataKey="salary"
                      radius={[6, 6, 0, 0]}
                      style={{ outline: "none" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default Payslip;