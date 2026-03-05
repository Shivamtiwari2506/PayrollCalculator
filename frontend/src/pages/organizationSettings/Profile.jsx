import { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material";
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BasicInfo from "../../components/organizations/organizationProfile/BasicInfo";
import CompanyDetails from "../../components/organizations/organizationProfile/CompanyDetails";
import AddressInfo from "../../components/organizations/organizationProfile/AddressInfo";
import TaxLegalInfo from "../../components/organizations/organizationProfile/TaxLegalInfo";
import BankInfo from "../../components/organizations/organizationProfile/BankInfo";
import PayrollFinanceInfo from "../../components/organizations/organizationProfile/PayrollFinanceInfo";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    orgName: "Helios Tech Labs",
    industry: "Software",
    companySize: "50-100",
    pan: "ABCDE1234F",
    gst: "22ABCDE1234F1Z5",
    address: "New Delhi, India",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    country: "India",
    timezone: "Asia/Kolkata",
    currency: "INR",
    logo: "",
    email: "contact@heliostechlabs.com",
    phone: "+91 98765 43210",
    website: "www.heliostechlabs.com",
    foundedYear: "2020",
    registrationNumber: "U72900DL2020PTC123456",
    taxId: "ABCDE1234F",
    bankName: "HDFC Bank",
    accountNumber: "1234567890",
    ifscCode: "HDFC0001234",
    payrollStartDate: "1",
    fiscalYearStart: "April",
    workingDays: "Monday to Friday",
    description: "Leading software development company specializing in enterprise solutions",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    console.log(form);
    setEditMode(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Organization Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your organization's information and settings
          </Typography>
        </Box>

        {!editMode ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            size="large"
          >
            Edit Profile
          </Button>
        ) : (
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size="large"
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => setEditMode(false)}
              size="large"
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Basic Information */}
      <BasicInfo form={form} editMode={editMode} handleChange={handleChange} />

      {/* Company Details */}
      <CompanyDetails form={form} editMode={editMode} handleChange={handleChange} />

      {/* Address Information */}
      <AddressInfo form={form} editMode={editMode} handleChange={handleChange} />

      {/* Tax & Legal Information */}
      <TaxLegalInfo form={form} editMode={editMode} handleChange={handleChange} />

      {/* Banking Information */}
      <BankInfo form={form} editMode={editMode} handleChange={handleChange} />

      {/* Payroll Settings */}
      <PayrollFinanceInfo form={form} editMode={editMode} handleChange={handleChange} />

    </Box>
  );
};

export default Profile;