import { Card, Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jul", payroll: 1520000, deductions: 210000 },
  { month: "Aug", payroll: 1610000, deductions: 225000 },
  { month: "Sep", payroll: 1580000, deductions: 218000 },
  { month: "Oct", payroll: 1700000, deductions: 240000 },
  { month: "Nov", payroll: 1650000, deductions: 230000 },
  { month: "Dec", payroll: 1780000, deductions: 255000 },
  { month: "Jan", payroll: 1720000, deductions: 248000 },
  { month: "Feb", payroll: 1800000, deductions: 260000 },
  { month: "Mar", payroll: 1840000, deductions: 270000 },
];

const quarterlyData = [
  { month: "Q1 FY24", payroll: 4710000, deductions: 653000 },
  { month: "Q2 FY24", payroll: 4930000, deductions: 693000 },
  { month: "Q3 FY24", payroll: 5150000, deductions: 733000 },
  { month: "Q4 FY24", payroll: 5360000, deductions: 778000 },
];

const formatINR = (value) => `₹${(value / 100000).toFixed(1)}L`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {payload.map((entry) => (
          <Box key={entry.name} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: entry.color }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {entry.name === "payroll" ? "Payroll" : "Deductions"}: {formatINR(entry.value)}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

export default function PayrollTrendChart() {
  const [view, setView] = useState("monthly");
  const data = view === "monthly" ? monthlyData : quarterlyData;

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Payroll Trend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Payroll vs deductions over time
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          size="small"
          sx={{ "& .MuiToggleButton-root": { px: 1.5, py: 0.5, fontSize: "0.75rem", textTransform: "none" } }}
        >
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="quarterly">Quarterly</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="deductionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatINR} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="payroll" stroke="#6366f1" strokeWidth={2.5} fill="url(#payrollGrad)" dot={false} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="deductions" stroke="#ec4899" strokeWidth={2.5} fill="url(#deductionGrad)" dot={false} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>

      <Box sx={{ display: "flex", gap: 3, mt: 2, justifyContent: "center" }}>
        {[{ color: "#6366f1", label: "Gross Payroll" }, { color: "#ec4899", label: "Deductions" }].map((l) => (
          <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 12, height: 3, borderRadius: 2, bgcolor: l.color }} />
            <Typography variant="caption" color="text.secondary">{l.label}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
