import { Card, Box, Typography, Grid, ButtonBase } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import CalculateIcon from "@mui/icons-material/Calculate";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssessmentIcon from "@mui/icons-material/Assessment";

const actions = [
  { label: "Run Payroll", icon: <PaymentsIcon />, color: "#6366f1", bg: "#eef2ff" },
  { label: "Add Employee", icon: <PersonAddIcon />, color: "#10b981", bg: "#ecfdf5" },
  { label: "Generate Payslip", icon: <DescriptionIcon />, color: "#f59e0b", bg: "#fffbeb" },
  { label: "Tax Calculator", icon: <CalculateIcon />, color: "#ec4899", bg: "#fdf2f8" },
  { label: "Import Data", icon: <UploadFileIcon />, color: "#3b82f6", bg: "#eff6ff" },
  { label: "Reports", icon: <AssessmentIcon />, color: "#8b5cf6", bg: "#f5f3ff" },
];

export default function QuickActions() {
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={1.5}>
        {actions.map((action) => (
          <Grid item xs={4} key={action.label}>
            <ButtonBase
              sx={{
                width: "100%",
                borderRadius: 2.5,
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: action.bg,
                  border: "1px solid transparent",
                  "&:hover": { borderColor: action.color + "44" },
                }}
              >
                <Box sx={{ color: action.color, display: "flex" }}>{action.icon}</Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: action.color, textAlign: "center", lineHeight: 1.2 }}
                >
                  {action.label}
                </Typography>
              </Box>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
