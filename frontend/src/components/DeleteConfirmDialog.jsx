import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Delete item",
  description = "This action cannot be undone.",
  itemName,
  loading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0px 24px 48px rgba(220, 38, 38, 0.2)',
          overflow: 'hidden',
        },
      }}
    >
      {/* HEADER with gradient background */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Please confirm this action
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* BODY */}
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {description}
        </Typography>

        {itemName && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '1px solid #fca5a5',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Item to be deleted:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: 'error.main',
                wordBreak: 'break-word',
              }}
            >
              {itemName}
            </Typography>
          </Box>
        )}

        {/* Warning message */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            display: 'flex',
            gap: 1.5,
          }}
        >
          <WarningAmberRoundedIcon sx={{ color: '#f59e0b', fontSize: 20, mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Warning:</strong> This action is permanent and cannot be reversed. All associated data will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      {/* ACTIONS */}
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{
            minWidth: 100,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          size="large"
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <DeleteOutlineIcon />
            )
          }
          sx={{
            minWidth: 120,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              boxShadow: '0px 8px 16px rgba(220, 38, 38, 0.4)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
            },
          }}
        >
          {loading ? "Deleting..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;