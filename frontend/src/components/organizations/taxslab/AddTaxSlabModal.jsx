import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import AddIcon from "@mui/icons-material/Add";
import PaidIcon from "@mui/icons-material/Paid";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const AddTaxSlabModal = ({ openModal, handleCloseModal, selectedFY, selectedRegime, regimeData, newSlab, handleSlabChange, handleAddSlab, error, handleSaveRegime, handleResetForm, handleRegimeDataChange, loading, updating }) => {
  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PaidIcon sx={{ mr: 1 }} />
          {selectedRegime === "new" ? "New" : "Old"} Tax Regime for {selectedFY}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error?.general && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error.general}
            </Alert>
          )}

          {/* Regime Settings */}
          <Typography variant="h6" sx={{ mb: 2 }}>Regime Settings</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField
                label="Standard Deduction"
                type="number"
                fullWidth
                required
                value={regimeData.standardDeduction}
                onChange={(e) => handleRegimeDataChange("standardDeduction", e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cess"
                type="number"
                fullWidth
                required
                value={regimeData.cessPercentage}
                onChange={(e) => handleRegimeDataChange("cessPercentage", e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Tax Slabs Section */}
          <Typography variant="h6" sx={{ mb: 2 }}>Tax Slabs</Typography>

          {/* Add Slab Form */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <TextField
                label="Min Income"
                type="number"
                fullWidth
                error={!!error?.minIncome}
                helperText={error?.minIncome}
                value={newSlab.minIncome}
                onChange={(e) => handleSlabChange("minIncome", e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Max Income (Optional)"
                type="number"
                fullWidth
                error={!!error?.maxIncome}
                helperText={error?.maxIncome}
                value={newSlab.maxIncome}
                onChange={(e) => handleSlabChange("maxIncome", e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Rate"
                type="number"
                fullWidth
                error={!!error?.rate}
                helperText={error?.rate}
                value={newSlab.rate}
                onChange={(e) => handleSlabChange("rate", e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                onClick={handleAddSlab}
                sx={{ height: "56px" }}
              >
                <AddIcon />
              </Button>
            </Grid>
          </Grid>

          {/* Current Slabs */}
          {regimeData.taxSlabs.length > 0 && (
            <TableContainer sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Income Range</TableCell>
                    <TableCell>Tax Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regimeData.taxSlabs.map((slab) => (
                    <TableRow key={slab.id}>
                      <TableCell>
                        ₹{slab.minIncome.toLocaleString()} - {slab.maxIncome ? `₹${slab.maxIncome.toLocaleString()}` : "Above"}
                      </TableCell>
                      <TableCell>
                        <Chip label={`${slab.rate}%`} color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {!updating && <Button
         disabled={loading}
         onClick={handleResetForm}>
          Reset
        </Button>}
        <Button
          disabled={loading}
         onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleSaveRegime}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          Save Regime
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddTaxSlabModal