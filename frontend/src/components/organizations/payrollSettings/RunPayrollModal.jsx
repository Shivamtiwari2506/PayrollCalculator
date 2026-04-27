import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress, Alert,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/commonFunctions/errorHandler";

const RunPayrollModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Default to current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);

  const handleRun = async () => {
    if (!month) {
      setError("Please select a month.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/payroll/run", { month });
      if (res?.data?.success) {
        toast.success(`Payroll for ${month} completed successfully`);
        onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || "Failed to run payroll";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError("");
    setMonth(currentMonth);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PlayArrowIcon sx={{ color: "success.main" }} />
          Run Payroll
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the month to process payroll for all active employees using the current active payroll settings.
        </Typography>

        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Payroll Month
        </Typography>
        <input
          type="month"
          value={month}
          onChange={(e) => { setMonth(e.target.value); setError(""); }}
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            fontSize: 14,
            border: "1px solid #ccc",
            borderRadius: 8,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
          This action cannot be undone. Payroll can only be run once per month.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleRun}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          {loading ? "Processing..." : "Run Payroll"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RunPayrollModal;
