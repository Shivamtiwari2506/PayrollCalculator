import { Card, Box, Typography } from "@mui/material";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Net Pay", value: 78, fill: "#6366f1", amount: "₹14.4L" },
  { name: "PF", value: 12, fill: "#10b981", amount: "₹2.2L" },
  { name: "Tax (TDS)", value: 7, fill: "#f59e0b", amount: "₹1.3L" },
  { name: "Other Ded.", value: 3, fill: "#ec4899", amount: "₹0.5L" },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
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
        <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.name}</Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {item.value}% · {item.amount}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function SalaryBreakdownChart() {
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
          Salary Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gross ₹18.4L this month
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={90}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            minAngle={10}
            dataKey="value"
            cornerRadius={6}
            background={{ fill: "#f8fafc" }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {data.map((item) => (
          <Box key={item.name} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.fill }} />
              <Typography variant="caption" color="text.secondary">{item.name}</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.amount}</Typography>
              <Typography variant="caption" color="text.secondary">{item.value}%</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
