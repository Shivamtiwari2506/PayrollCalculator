import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  InputAdornment,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PaidIcon from "@mui/icons-material/Paid";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

import AddTaxSlabModal from "../../components/organizations/taxslab/AddTaxSlabModal";

const IncomeTaxSlabs = () => {

  const [selectedFY, setSelectedFY] = useState("2025-26");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegime, setSelectedRegime] = useState("new");
  const [openModal, setOpenModal] = useState(false);

  const [newSlab, setNewSlab] = useState({
    minIncome: "",
    maxIncome: "",
    rate: ""
  });

  const [taxSettings, setTaxSettings] = useState({
    standardDeduction: 50000,
    cessPercentage: 4
  });

  const [taxSlabs, setTaxSlabs] = useState([]);

  const financialYears = ["2024-25", "2025-26", "2026-27"];

  const handleFormChange = (name, value) => {
    if (name === "maxIncome" && value === "") {
      value = null; // Allow empty max income
    }

    if (error && error[name]) {
      setError({ ...error, [name]: null });
    }
    setNewSlab((prevSlab) => ({ ...prevSlab, [name]: value }));
  };

  const handleCloseModal = () => {
    setNewSlab({ minIncome: "", maxIncome: "", rate: "" });
    setError(null);
    setOpenModal(false);
  };

  const handleAddSlab = () => {
    const min = parseInt(newSlab.minIncome);
    const max = newSlab.maxIncome ? parseInt(newSlab.maxIncome) : null;
    const rate = parseFloat(newSlab.rate);

    // Validation
    if (isNaN(min) || min < 0) {
      setError({ ...error, minIncome: "Please enter a valid minimum income" })
      return;
    }
    if (max && max <= min) {
      setError({ ...error, maxIncome: "Maximum income should be greater than minimum income" });
      return;
    }
    if (isNaN(rate) || rate < 0 || rate > 100) {
      setError({ ...error, rate: "Rate should be between 0 and 100" });
      return;
    }

    const slab = {
      id: Date.now(),
      financialYear: selectedFY,
      regime: selectedRegime,
      minIncome: min,
      maxIncome: max,
      rate: rate
    };

    setTaxSlabs([...taxSlabs, slab]);
    setNewSlab({ minIncome: "", maxIncome: "", rate: "" });
    setOpenModal(false);
  };

  const handleDeleteSlab = (id) => {
    setTaxSlabs(taxSlabs.filter(slab => slab.id !== id));
  };

  const handleSaveTaxSettings = async () => {
    try {
      // Here you would make the API call to save tax settings
      // await api.saveTaxSettings(taxSettings);
      console.log("Saving tax settings:", taxSettings);
    } catch (error) {
    }
  };

  const handleSaveTaxSlabs = async () => {
    try {
      const slabsToSave = slabsForSelection;
      if (slabsToSave.length === 0) {
        return;
      }
      // Here you would make the API call to save tax slabs
      // await api.saveTaxSlabs(slabsToSave);
      console.log("Saving tax slabs:", slabsToSave);
    } catch (error) {
    }
  };

  const slabsForSelection = taxSlabs.filter(
    s => s.financialYear === selectedFY && s.regime === selectedRegime
  );

  return (
    <Box>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <PaidIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Income Tax Configuration
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Select a financial year and tax regime to configure tax slabs.
        </Typography>
      </Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Configure income tax slabs used for TDS calculation.
      </Alert>

      {/* Tax Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography fontWeight={600}>
              Tax Settings
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={disabled ? <EditIcon /> : <CancelIcon />}
                onClick={() => {setDisabled(!disabled)}}
                size="small"
              >
                {disabled ? "Edit" : "Cancel"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={disabled}
                onClick={handleSaveTaxSettings}
                size="small"
              >
                Save Settings
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>


            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Financial Year"
                fullWidth
                disabled={disabled}
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
              >
                {financialYears.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Tax Regime"
                disabled={disabled}
                fullWidth
                value={selectedRegime}
                onChange={(e) => setSelectedRegime(e.target.value)}
              >
                <MenuItem value="new">New Regime</MenuItem>
                <MenuItem value="old">Old Regime</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Standard Deduction"
                type="number"
                fullWidth
                disabled={disabled}
                value={taxSettings.standardDeduction}
                onChange={(e) => setTaxSettings({ ...taxSettings, standardDeduction: parseInt(e.target.value) || 0 })}
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
                disabled={disabled}
                value={taxSettings.cessPercentage}
                onChange={(e) => setTaxSettings({ ...taxSettings, cessPercentage: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
          </Grid>

        </CardContent>
      </Card>

      {/* Slabs Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography fontWeight={600}>
              Tax Slabs for {selectedFY} ({selectedRegime === "new" ? "New" : "Old"} Regime)
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenModal(true)}
                size="small"
              >
                Add Tax Slab
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveTaxSlabs}
                size="small"
                disabled={slabsForSelection.length === 0}
              >
                Save Slabs
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Income Range</TableCell>
                  <TableCell>Tax Rate</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {slabsForSelection.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No tax slabs configured for {selectedFY} ({selectedRegime === "new" ? "New" : "Old"} Regime)
                      </Typography>
                      <Button
                        variant="text"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenModal(true)}
                        sx={{ mt: 1 }}
                      >
                        Add your first tax slab
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  slabsForSelection.map((slab) => (
                    <TableRow key={slab.id}>
                      <TableCell>
                        ₹{slab.minIncome.toLocaleString()} - {slab.maxIncome ? `₹${slab.maxIncome.toLocaleString()}` : "Above"}
                      </TableCell>

                      <TableCell>
                        <Chip label={`${slab.rate}%`} color="success" />
                      </TableCell>

                      <TableCell align="center">

                        <IconButton
                          color="primary"
                          onClick={() => handleEditSlab(slab.id)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSlab(slab.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </CardContent>
      </Card>

      {/* Add Tax Slab Modal */}
      <AddTaxSlabModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedFY={selectedFY}
        selectedRegime={selectedRegime}
        newSlab={newSlab}
        handleFormChange={handleFormChange}
        handleAddSlab={handleAddSlab}
        error={error}
        setError={setError}
      />

    </Box>
  );
};

export default IncomeTaxSlabs;