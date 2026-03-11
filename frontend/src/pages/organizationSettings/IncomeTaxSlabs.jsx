import { useEffect, useState } from "react";
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
  Chip,
  MenuItem,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PaidIcon from "@mui/icons-material/Paid";
import EditIcon from "@mui/icons-material/Edit";
import AddTaxSlabModal from "../../components/organizations/taxslab/AddTaxSlabModal";
import api from "../../services/api";
import { toast } from 'react-toastify';
import { handleApiError } from "../../utils/commonFunctions/errorHandler";
import { formatIndianRuppee } from "../../utils/commonFunctions/helpers";
import Loader from "../../utils/Loader";


const IncomeTaxSlabs = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFY, setSelectedFY] = useState("");
  const [selectedRegime, setSelectedRegime] = useState("new");
  console.log(selectedRegime, selectedFY)
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regimeLoading, setRegimeLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form data for the modal
  const [regimeData, setRegimeData] = useState({
    standardDeduction: "",
    cessPercentage: "",
    taxSlabs: []
  });
  console.log("formData",regimeData)

  const [newSlab, setNewSlab] = useState({
    minIncome: "",
    maxIncome: "",
    rate: ""
  });

  // Stored tax regimes data
  const [taxRegimes, setTaxRegimes] = useState(null);
  console.log("taxRegimes",taxRegimes)

  const handleTabChange = (event, newValue) => {
    setSelectedRegime(newValue);
  };

  const handleOpenModal = (type = "new") => {
    if (type === "edit") {
      setUpdating(true);
    } else {
      setRegimeData({
        standardDeduction: "",
        cessPercentage: "",
        taxSlabs: []
      });
      setNewSlab({ minIncome: "", maxIncome: "", rate: "" });
    }
    setError(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setRegimeData({
      standardDeduction: "",
      cessPercentage: "",
      taxSlabs: []
    });
    setNewSlab({ minIncome: "", maxIncome: "", rate: "" });
    setError(null);
  };

  const handleRegimeDataChange = (field, value) => {
    setRegimeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSlabChange = (field, value) => {
    if (field === "maxIncome" && value === "") {
      value = null;
    }
    setNewSlab(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error && error[field]) {
      setError({ ...error, [field]: null });
    }
  };

  const handleAddSlab = () => {
    const min = parseInt(newSlab.minIncome);
    const max = newSlab.maxIncome ? parseInt(newSlab.maxIncome) : null;
    const rate = parseFloat(newSlab.rate);

    // Validation
    if (isNaN(min) || min < 0) {
      setError({ ...error, minIncome: "Please enter a valid minimum income" });
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
      minIncome: min,
      maxIncome: max,
      rate: rate
    };

    setRegimeData(prev => ({
      ...prev,
      taxSlabs: [...prev.taxSlabs, slab]
    }));

    setNewSlab({ minIncome: "", maxIncome: "", rate: "" });
    setError(null);
  };

  const handleResetForm = () => {
    setRegimeData({
        standardDeduction: "",
        cessPercentage: "",
        taxSlabs: []
      });
      setNewSlab({ minIncome: "", maxIncome: "", rate: "" });
  };

  const handleSaveRegime = () => {
    // Validation
    if (!regimeData.standardDeduction || !regimeData.cessPercentage) {
      setError({ general: "Please fill in standard deduction and cess percentage" });
      return;
    }

    if (regimeData.taxSlabs.length === 0) {
      setError({ general: "Please add at least one tax slab" });
      return;
    }

    const newRegime = {
      financialYear: selectedFY,
      regime: selectedRegime,
      standardDeduction: parseInt(regimeData.standardDeduction),
      cessPercentage: parseFloat(regimeData.cessPercentage),
      slabs: regimeData.taxSlabs
    };

    handleCreateTaxSlab(newRegime);
  };

  const handleCreateTaxSlab = async (newRegime) => {
    console.log(newRegime)
    setLoading(true);
    try {
      let response;
      if(updating) {
        response = await api.put('/tax-slab', newRegime);
      } else {
        response = await api.post('/tax-slab', newRegime);
      }

      if(response?.data && response?.data?.success === true) {
        toast.success(response?.data?.message);
        getCurrentRegime();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
      handleCloseModal();
      setUpdating(false);
    }
  }

  const getCurrentRegime = async () => {
    setRegimeLoading(true);
    try {
      const response = await api.get('/tax-slab', {
        params: {
          financialYear: selectedFY,
          regime: selectedRegime
        }
      });
      if(response?.data && response?.data?.success === true) {
        setTaxRegimes(response?.data?.data);
      }
    } catch (error) {
      toast.info(error?.response?.data?.message);
        setTaxRegimes(null);
    } finally {
      setRegimeLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let startYear;
    if (month >= 3) {
      startYear = year;
    } else {
      startYear = year - 1;
    }

    const years = [];

    for (let i = 0; i < 5; i++) {
      const start = startYear + i;
      const end = start + 1;
      years.push(`${start}-${end}`);
    }

    setFinancialYears(years);
    setSelectedFY(`${startYear}-${startYear + 1}`);
  }, []);

  useEffect(() => {
    if(!selectedFY || !selectedRegime) return;
    getCurrentRegime();
  }, [selectedFY, selectedRegime]);

  if(regimeLoading) {
    return <Loader />;
  }

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
          Configure income tax slabs for different financial years and tax regimes.
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure income tax slabs used for TDS calculation.
      </Alert>

      {/* Financial Year Selection */}

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Financial Year"
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
              >
                {financialYears.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

      {/* Tax Regimes Table */}
      <Box>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedRegime} onChange={handleTabChange}>
            <Tab label="New Tax Regime" value="new" />
            <Tab label="Old Tax Regime" value="old" />
          </Tabs>
        </Box>

        {/* Table Content */}
        {taxRegimes!==null ? (
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">
                  {selectedRegime === "new" ? "New" : "Old"} Tax Regime - {selectedFY}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenModal("edit")}
                  size="small"
                >
                  Edit Regime
                </Button>
              </Box>

              {/* Regime Info */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Standard Deduction</Typography>
                  <Typography variant="h6">{formatIndianRuppee(taxRegimes.standardDeduction)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Cess</Typography>
                  <Typography variant="h6">{taxRegimes.cessPercentage}%</Typography>
                </Grid>
              </Grid>

              {/* Tax Slabs Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Income Range</TableCell>
                      <TableCell>Tax Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taxRegimes?.slabs?.map((slab) => (
                      <TableRow key={slab.id}>
                        <TableCell>
                          {formatIndianRuppee(slab.minIncome)} - {slab.maxIncome ? `${formatIndianRuppee(slab.maxIncome)}` : "Above"}
                        </TableCell>
                        <TableCell>
                          <Chip label={`${slab.rate}%`} color="success" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No {selectedRegime === "new" ? "New" : "Old"} Tax Regime configured for {selectedFY}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModal}
                >
                  Add Tax Regime
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Add/Edit Regime Modal */}
      <AddTaxSlabModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedFY={selectedFY}
        selectedRegime={selectedRegime}
        regimeData={regimeData}
        newSlab={newSlab}
        handleSlabChange={handleSlabChange}
        handleAddSlab={handleAddSlab}
        error={error}
        handleSaveRegime={handleSaveRegime}
        handleResetForm={handleResetForm}
        handleRegimeDataChange={handleRegimeDataChange}
        loading={loading}
        updating={updating}
      />
    </Box>
  );
};

export default IncomeTaxSlabs;