import React from "react";
import {
  Box,
  Typography,
  Switch,
  Chip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";


const PremiumSwitch = styled(Switch)(({ theme }) => ({
  width: 56,
  height: 30,
  padding: 0,

  "& .MuiSwitch-switchBase": {
    padding: 3,
    transitionDuration: "300ms",

    "&.Mui-checked": {
      transform: "translateX(26px)",
      color: "#fff",

      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.success.main,
        opacity: 1,
      },
    },
  },

  "& .MuiSwitch-thumb": {
    width: 24,
    height: 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  "& .MuiSwitch-track": {
    borderRadius: 30,
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 300,
    }),
  },
}));


const StatusToggle = ({
  value = false,
  onChange,
  title = "Account Status",
  subtitle = "Enable or disable user access",
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  disabled = false,
}) => {
  const isActive = Boolean(value);

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        p: 2.5,
        // borderRadius: "16px",
        // border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        transition: "all 0.25s ease",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",

        // "&:hover": {
        //   boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        //   borderColor: theme.palette.primary.main,
        //   background: alpha(theme.palette.primary.main, 0.02),
        // },
      })}
    >
      {/* LEFT */}
      <Box>
        <Typography fontWeight={700} fontSize={16}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>

        <Chip
          label={isActive ? activeLabel : inactiveLabel}
          size="small"
          color={isActive ? "success" : "default"}
          sx={{ mt: 1, fontWeight: 600 }}
        />
      </Box>

      {/* RIGHT */}
      <PremiumSwitch
        checked={isActive}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </Box>
  );
};

export default StatusToggle;