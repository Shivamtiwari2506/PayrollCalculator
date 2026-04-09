import { Card, Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Engineering", value: 6800000, color: "#6366f1" },
  { name: "Sales", value: 3200000, color: "#10b981" },
  { name: "HR & Admin", value: 1800000, color: "#f59e0b" },
  { name: "Finance", value: 2100000, color: "#ec4899" },
  { name: "Operations", value: 2500000, color: "#3b82f6" },
  { name: "Marketing", value: 1900000, color: "#8b5cf6" },
];

const formatINR = (value) => `₹${(value / 100000).toFixed(1)}L`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.payload.color }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.name}</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {formatINR(item.value)} ({((item.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)
        </Typography>
      </Box>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.07) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SalaryDistributionChart() {
  const total = data.reduce((a, b) => a + b.value, 0);

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
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Salary by Department
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {formatINR(total)}
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {data.map((item) => (
          <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 0.6, minWidth: "45%" }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color, flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
