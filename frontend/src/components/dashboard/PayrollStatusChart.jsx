import { Card, Box, Typography, LinearProgress } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const statusData = [
  { name: "Processed", value: 198, color: "#10b981" },
  { name: "Pending", value: 36, color: "#f59e0b" },
  { name: "On Hold", value: 14, color: "#ef4444" },
];

const total = statusData.reduce((a, b) => a + b.value, 0);

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
        <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.name}</Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {item.value} employees ({((item.value / total) * 100).toFixed(1)}%)
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function PayrollStatusChart() {
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
          Payroll Status
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current cycle — April 2026
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flexShrink: 0 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Center label overlay */}
        <Box sx={{ flex: 1 }}>
          {statusData.map((item) => (
            <Box key={item.name} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {item.value}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(item.value / total) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: `${item.color}22`,
                  "& .MuiLinearProgress-bar": { bgcolor: item.color, borderRadius: 3 },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
