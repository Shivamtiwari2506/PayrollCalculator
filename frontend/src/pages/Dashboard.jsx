import { Box, Typography, Grid } from "@mui/material";
import DashboardStatCards from "../components/dashboard/DashboardStatCards";
import PayrollTrendChart from "../components/dashboard/PayrollTrendChart";
import SalaryDistributionChart from "../components/dashboard/SalaryDistributionChart";
import HeadcountChart from "../components/dashboard/HeadcountChart";
import PayrollStatusChart from "../components/dashboard/PayrollStatusChart";
import RecentPayrollTable from "../components/dashboard/RecentPayrollTable";
import QuickActions from "../components/dashboard/QuickActions";
import UpcomingPayroll from "../components/dashboard/UpcomingPayroll";
import SalaryBreakdownChart from "../components/dashboard/SalaryBreakdownChart";

export default function Dashboard() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: '-0.02em'
          }}
        >
          Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mt: 0.5,
            fontWeight: 500
          }}
        >
          Welcome back! Here's what's happening with your payroll today.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ mb: 3 }}>
        <DashboardStatCards />
      </Box>

      {/* Row 2: Payroll Trend + Status + Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <PayrollTrendChart />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <PayrollStatusChart />
        </Grid>
      </Grid>

      {/* Row 3: Dept Salary Pie + Headcount Bar + Salary Breakdown Radial */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <SalaryDistributionChart />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <HeadcountChart />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SalaryBreakdownChart />
        </Grid>
      </Grid>

      {/* Row 4: Recent Payroll Table + Quick Actions + Upcoming */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <RecentPayrollTable />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.5}>
          <QuickActions />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.5}>
          <UpcomingPayroll />
        </Grid>
      </Grid>
    </Box>
  );
}
