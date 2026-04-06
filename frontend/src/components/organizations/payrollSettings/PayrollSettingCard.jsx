import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useState } from "react";

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.4 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="caption" fontWeight={600} color="text.primary">
      {value}
    </Typography>
  </Box>
);

const PayrollSettingCard = ({ config, handleEdit, handleDelete }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const cycleLabel =
    config.payrollCycle === "biweekly"
      ? "Bi-Weekly"
      : config.payrollCycle === "monthly"
        ? "Monthly"
        : "Weekly";

  const effectiveFrom = config.effectiveFrom
    ? new Date(config.effectiveFrom).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—";

  const effectiveTo = config.effectiveTo
    ? new Date(config.effectiveTo).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : null;

  const statusColorMap = {
    DRAFT: "default",
    SCHEDULED: "warning",
    ACTIVE: "success",
    EXPIRED: "error"
  };


  return (
    <>
      <Card
        elevation={2}
        sx={{
          minWidth: 260,
          maxWidth: 280,
          flexShrink: 0,
          borderRadius: 1,
          border: "2px solid",
          borderColor: config.isActive ? "primary.main" : "divider",
          position: "relative",
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: 4 },
        }}
      >
        <CardContent sx={{"&:last-child": { pb: 2 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ color: "primary.main", fontSize: 20 }} />
              <Chip
                label={cycleLabel || "—"}
                size="small"
                color="primary"
                sx={{
                  fontWeight: 600,
                  height: 20,
                  fontSize: "0.7rem",
                  "& .MuiChip-label": { px: 0.8 }
                }}
              />
            </Box>

            {/* RIGHT SIDE */}
            <Box sx={{ display: "flex", alignItems: "center"}}>

              {/* STATUS CHIP */}
              <Tooltip title={config?.status || "Unknown"}>
                <Chip
                  label={config?.status || "Unknown"}
                  size="small"
                  color={statusColorMap[config?.status] || "default"}
                  sx={{
                    fontWeight: 600,
                    height: 20,
                    fontSize: "0.7rem",
                    "& .MuiChip-label": { px: 0.8 }
                  }}
                />
              </Tooltip>

              {config.status === "SCHEDULED" && config.isLocked === false && <IconButton size="small" sx={{ p:0, m: 0, ml: 1}} onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>}
            </Box>
          </Box>

          {/* Effective period */}
          <Box sx={{display: "flex", gap: 2, pb: 1}}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            Effecttive From: {effectiveFrom}
          </Typography>
          {!config?.isLocked &&<Chip
            label={"Locked"}
            size="small"
            color="error"
            sx={{
              fontWeight: 600,
              height: 20,
              fontSize: "0.7rem",
              "& .MuiChip-label": { px: 0.8 }
            }}
          />}
          </Box>
          {effectiveTo && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
            Effecttive To : {effectiveTo}
          </Typography>}

          <Divider sx={{ mb: 1.5 }} />

          {/* Salary structure */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <AccountBalanceWalletIcon sx={{ color: "success.main", fontSize: 16 }} />
            <Typography variant="caption" fontWeight={700} color="text.primary">
              Salary Structure
            </Typography>
          </Box>
          <InfoRow label="Basic" value={`${config.basicPercent ?? "—"}%`} />
          <InfoRow label="HRA" value={`${config.hraPercent ?? "—"}%`} />
          <InfoRow label="Allowance" value={`${config.allowancePercent ?? "—"}%`} />

          <Divider sx={{ my: 1.5 }} />

          {/* Cycle details */}
          <InfoRow label="Working Days" value={config.workingDaysPerMonth ?? "—"} />
          <InfoRow label="PF" value={config.pfEnabled ? `${config.pfPercent}%` : "Disabled"} />
          <InfoRow label="ESI" value={config.esiEnabled ? `${config.esiPercent}%` : "Disabled"} />
          <InfoRow label="Overtime" value={config.overtimeEnabled ? `${config.overtimeRate}x` : "Disabled"} />
        </CardContent>
      </Card>
      {config.status === "SCHEDULED" && config.isLocked === false && <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleEdit(config);
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleDelete(config.id);
          }}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>
      </Menu>}
    </>
  );
};

export default PayrollSettingCard;
