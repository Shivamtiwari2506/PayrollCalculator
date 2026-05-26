import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { SearchOff } from "@mui/icons-material";


export default function NoDataFound({
  message = "No data found",
  description = "Try adjusting your filters or search terms.",
  Icon = SearchOff,
  actionLabel,
  onAction,
  className = "",
}) {

  return (
    <Box
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <Box
        className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
        sx={{ backgroundColor: "action.hover" }}
      >
        <Icon
          sx={{ fontSize: 40, color: "text.disabled" }}
          aria-hidden="true"
        />
      </Box>

      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        sx={{ color: "text.primary", letterSpacing: "-0.01em" }}
      >
        {message}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", maxWidth: 320, lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      )}

      {actionLabel && onAction && (
        <Button
          variant="outlined"
          size="medium"
          onClick={onAction}
          className="mt-6"
          sx={{ mt: 3, borderRadius: "8px", textTransform: "none", fontWeight: 500 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}