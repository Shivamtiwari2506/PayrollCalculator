import { Grid, Card, Box, Typography, Avatar } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const stats = [
  {
    title: "Total Employees",
    value: "248",
    change: "+12",
    changeLabel: "this month",
    up: true,
    icon: <PeopleAltIcon sx={{ fontSize: 28 }} />,
    gradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    bg: "#eef2ff",
    iconColor: "#6366f1",
  },
  {
    title: "Total Payroll",
    value: "₹18.4L",
    change: "+5.2%",
    changeLabel: "vs last month",
    up: true,
    icon: <PaymentsIcon sx={{ fontSize: 28 }} />,
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    bg: "#ecfdf5",
    iconColor: "#10b981",
  },
  {
    title: "Pending Payslips",
    value: "14",
    change: "-3",
    changeLabel: "from last run",
    up: false,
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    bg: "#fffbeb",
    iconColor: "#f59e0b",
  },
  {
    title: "Avg. Salary",
    value: "₹74,200",
    change: "+2.1%",
    changeLabel: "vs last month",
    up: true,
    icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
    gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    bg: "#fdf2f8",
    iconColor: "#ec4899",
  },
];

export default function DashboardStatCards() {
  return (
    <Grid container spacing={3}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} lg={3} key={stat.title}>
          <Card
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
              },
            }}
          >

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1.5 }}>
                  {stat.value}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {stat.up ? (
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: "success.main" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: 14, color: "error.main" }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{ color: stat.up ? "success.main" : "error.main", fontWeight: 600 }}
                  >
                    {stat.change}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.changeLabel}
                  </Typography>
                </Box>
              </Box>

              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: stat.bg,
                  color: stat.iconColor,
                  borderRadius: 2.5,
                }}
              >
                {stat.icon}
              </Avatar>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
