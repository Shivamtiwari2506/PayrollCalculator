import { Card, Box, Typography, Avatar } from "@mui/material";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card
      elevation={2}
      
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        p: 2.5,
        pl: 3,
        // my: 3,
        bgcolor: "#fff",
        borderRadius: 1,
        position: "relative",
        overflow: "hidden",

        // LEFT COLOR STRIPE
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: color,
        },

        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      {/* ICON */}
      <Avatar
        sx={{
          bgcolor: color,
          width: 64,
          height: 64,
        }}
      >
        {icon}
      </Avatar>

      {/* TEXT */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Card>
  );
};

export default StatCard;