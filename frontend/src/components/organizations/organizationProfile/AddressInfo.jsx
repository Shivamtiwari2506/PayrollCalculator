import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  Box,
  Chip
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import axios from "axios";

const AddressInfo = ({ form, editMode, handleChange }) => {

  console.log("form: ", form);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const removeOfficeLocation = (location) => {
    const updated = (form.officeLocations || []).filter(
      (loc) => loc !== location
    );

    handleChange("officeLocations", updated);
  };

  // Fetch countries
  useEffect(() => {
    const getCountries = async () => {
      const res = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
      setCountries(res.data.data);
    };

    getCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!form.country) return;

    const getStates = async () => {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: form.country }
      );

      setStates(res.data.data.states || []);
    };

    getStates();
  }, [form.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!form.state) return;

    const getCities = async () => {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          country: form.country,
          state: form.state,
        }
      );

      setCities(res.data.data || []);
    };

    getCities();
  }, [form.state]);

  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 1 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Address Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Registered Address"
              fullWidth
              value={form.address}
              disabled={!editMode}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Country"
              fullWidth
              value={form.country}
              disabled={!editMode}
              onChange={(e) => handleChange("country", e.target.value)}
            >
              {countries.map((c) => (
                <MenuItem key={c.country} value={c.country}>
                  {c.country}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* State */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="State"
              fullWidth
              value={form.state}
              disabled={!editMode}
              onChange={(e) => handleChange("state", e.target.value)}
            >
              {states.map((s) => (
                <MenuItem key={s.name} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* City */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="City"
              fullWidth
              value={form.city}
              disabled={!editMode}
              onChange={(e) => handleChange("city", e.target.value)}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Pincode"
              fullWidth
              value={form.pincode}
              disabled={!editMode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 6
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Office Locations
            </Typography>

            <Select
              multiple
              fullWidth
              value={form.officeLocations || []}
              disabled={!editMode}
              onChange={(e) => handleChange("officeLocations", e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      color="primary"
                      onMouseDown={(event) => event.stopPropagation()}
                      onDelete={(event) => {
                        if(!editMode) return;
                        event.stopPropagation();
                        removeOfficeLocation(value);
                      }}
                    />
                  ))}
                </Box>
              )}
            >
              {states.map((s) => (
                <MenuItem key={s.name} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AddressInfo;