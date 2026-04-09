import {
  Card,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const rows = [
  { id: "EMP001", name: "Arjun Sharma", dept: "Engineering", salary: "₹1,20,000", status: "Processed", avatar: "AS" },
  { id: "EMP002", name: "Priya Mehta", dept: "HR & Admin", salary: "₹68,000", status: "Processed", avatar: "PM" },
  { id: "EMP003", name: "Rahul Verma", dept: "Sales", salary: "₹85,000", status: "Pending", avatar: "RV" },
  { id: "EMP004", name: "Sneha Iyer", dept: "Finance", salary: "₹92,000", status: "Processed", avatar: "SI" },
  { id: "EMP005", name: "Karan Patel", dept: "Operations", salary: "₹74,000", status: "On Hold", avatar: "KP" },
  { id: "EMP006", name: "Divya Nair", dept: "Marketing", salary: "₹78,000", status: "Pending", avatar: "DN" },
];

const statusConfig = {
  Processed: { color: "success", bg: "#ecfdf5", text: "#059669" },
  Pending: { color: "warning", bg: "#fffbeb", text: "#d97706" },
  "On Hold": { color: "error", bg: "#fef2f2", text: "#dc2626" },
};

const avatarColors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#8b5cf6"];

export default function RecentPayrollTable() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recent Payroll Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest payroll processing status
          </Typography>
        </Box>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon />}
          sx={{ textTransform: "none", fontWeight: 500, color: "primary.main" }}
        >
          View All
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { bgcolor: "#f8fafc", fontWeight: 600, fontSize: "0.75rem", color: "#64748b", py: 1.5 } }}>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              const sc = statusConfig[row.status];
              return (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:hover": { bgcolor: "#f8fafc" },
                    "& td": { py: 1.5, borderColor: "#f1f5f9" },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          bgcolor: avatarColors[i % avatarColors.length],
                        }}
                      >
                        {row.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {row.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.dept}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.salary}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: sc.bg,
                        color: sc.text,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 22,
                        border: "none",
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
