import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const formatIndianNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
};

const parseIndianNumber = (value) => {
  if (!value) return "";
  return value.replace(/,/g, "");
};

const CurrencyInput = ({
  label,
  value,
  onChange,
  required = false,
  fullWidth = true,
  ...props
}) => {
    const handleChange = (e) => {
        const raw = parseIndianNumber(e.target.value);

        if (raw === "" || /^\d+$/.test(raw)) {
            onChange(raw === "" ? "" : Number(raw));
        }
    };

  return (
    <TextField
      label={label}
      value={formatIndianNumber(value)}
      onChange={handleChange}
      required={required}
      fullWidth={fullWidth}
      inputMode="numeric"
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">₹</InputAdornment>
        ),
      }}
    />
  );
};

export default CurrencyInput;