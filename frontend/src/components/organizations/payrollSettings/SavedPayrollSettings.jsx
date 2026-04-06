import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PayrollSettingCard from "./PayrollSettingCard";

const SavedPayrollSettings = ({ configs,setShowPayrollModal, handleEdit, handleDelete }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <HistoryIcon sx={{ color: "warning.main", fontSize: 24 }} />
        <Typography variant="h6" fontWeight={700}>
          Saved Configurations
        </Typography>
        {configs.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.1, fontWeight: 500 }}>
            ({configs.length})
          </Typography>
        )}
      </Box>
      
        <Button
          variant="contained"
          onClick={() => setShowPayrollModal(true)}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
          }}
        >
          + Create Payroll
        </Button>
      </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 1.5,
            // Custom scrollbar styling
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": { borderRadius: 3, bgcolor: "grey.100" },
            "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "grey.400" },
          }}
        >
          {configs.map((config) => (
            <PayrollSettingCard
             key={config.id} 
             config={config}
             handleEdit={handleEdit}
             handleDelete={handleDelete}
            />
          ))}
        </Box>
    </Box>
  );
};

export default SavedPayrollSettings;
