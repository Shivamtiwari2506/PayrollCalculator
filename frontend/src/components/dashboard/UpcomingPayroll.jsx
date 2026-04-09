import { Card, Box, Typography, Divider, Chip, LinearProgress } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const events = [
  {
    title: "April Payroll Processing",
    date: "Apr 25, 2026",
    daysLeft: 16,
    progress: 45,
    status: "In Progress",
    statusColor: "#6366f1",
    statusBg: "#eef2ff",
  },
  {
    title: "TDS Filing Deadline",
    date: "Apr 30, 2026",
    daysLeft: 21,
    progress: 20,
    status: "Upcoming",
    statusColor: "#f59e0b",
    statusBg: "#fffbeb",
  },
  {
    title: "PF Contribution Due",
    date: "May 15, 2026",
    daysLeft: 36,
    progress: 0,
    status: "Scheduled",
    statusColor: "#10b981",
    statusBg: "#ecfdf5",
  },
];

export default function UpcomingPayroll() {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <CalendarMonthIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Upcoming Deadlines
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {events.map((event, i) => (
          <Box key={event.title}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3 }}>
                  {event.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {event.date} · {event.daysLeft} days left
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={event.status}
                size="small"
                sx={{
                  bgcolor: event.statusBg,
                  color: event.statusColor,
                  fontWeight: 600,
                  fontSize: "0.68rem",
                  height: 20,
                }}
              />
            </Box>
            {event.progress > 0 && (
              <LinearProgress
                variant="determinate"
                value={event.progress}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  bgcolor: "#f1f5f9",
                  "& .MuiLinearProgress-bar": { bgcolor: event.statusColor, borderRadius: 3 },
                }}
              />
            )}
            {i < events.length - 1 && <Divider sx={{ mt: 2, borderColor: "#f1f5f9" }} />}
          </Box>
        ))}
      </Box>
    </Card>
  );
}
