import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, TextField } from '@mui/material'
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const AddTaxSlabModal = ({ openModal, handleCloseModal, selectedFY, selectedRegime, newSlab,handleFormChange, handleAddSlab, error }) => {
  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EditIcon sx={{ mr: 1 }} />
            Add Tax Slab
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Adding tax slab for <strong>{selectedFY}</strong> - <strong>{selectedRegime === "new" ? "New" : "Old"} Regime</strong>
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Minimum Income"
                  type="number"
                  required
                  fullWidth
                  error={!!error?.minIncome}
                  value={newSlab.minIncome}
                  onChange={(e) => handleFormChange("minIncome", e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                  helperText={error?.minIncome || "Enter the minimum income for this tax slab"}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Maximum Income (Optional)"
                  type="number"
                  fullWidth
                  error={!!error?.maxIncome}
                  value={newSlab.maxIncome}
                  onChange={(e) => handleFormChange("maxIncome", e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                  helperText={error?.maxIncome || "Leave empty for 'Above' range"}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Tax Rate"
                  type="number"
                  required
                  fullWidth
                  error={!!error?.rate}
                  value={newSlab.rate}
                  onChange={(e) => handleFormChange("rate", e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                  helperText={error?.rate || "Enter tax rate as percentage (0-100)"}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSlab} 
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Slab
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default AddTaxSlabModal