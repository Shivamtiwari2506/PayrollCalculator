import { useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import {Typography,Button,Box, CircularProgress} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import CancelIcon from '@mui/icons-material/Cancel';
import BasicInfo from "../../components/organizations/organizationProfile/BasicInfo";
import CompanyDetails from "../../components/organizations/organizationProfile/CompanyDetails";
import AddressInfo from "../../components/organizations/organizationProfile/AddressInfo";
import TaxLegalInfo from "../../components/organizations/organizationProfile/TaxLegalInfo";
import BankInfo from "../../components/organizations/organizationProfile/BankInfo";
import PayrollFinanceInfo from "../../components/organizations/organizationProfile/PayrollFinanceInfo";
import { toast } from 'react-toastify';
import api from "../../services/api";
import Loader from "../../utils/Loader";
import { hasFormChanged, getChangedFields } from "../../utils/commonFunctions/hasFormChanged";
import { getOrgData } from "../../redux/actions/orgActions";
import { getCurrentUser } from "../../redux/actions/userActions";

const Profile = () => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {

    if (field === "logo") {
      if (value === "remove") {
        setForm((prev) => ({
          ...prev,
          logo: "",
          logoFile: null
        }));
        return;
      }

      const file = value;
      if (!file) return;

      const maxSize = 1 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.info("File size should be less than 1MB");
        return;
      }

      const preview = URL.createObjectURL(file);

      setForm((prev) => ({
        ...prev,
        logo: preview,
        logoFile: file
      }));

    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Check if any field has changed (exclude logoFile from comparison)
      const fieldsToExclude = ['logoFile', 'logo'];
      const hasChanged = hasFormChanged(originalData, form, fieldsToExclude);
      
      // Check if logo has changed
      const logoChanged = form.logoFile !== null && form.logoFile !== undefined;

      if (!hasChanged && !logoChanged) {
        toast.info("No changes detected");
        setEditMode(false);
        return;
      }

      // Log which fields changed (for debugging)
      const changedFields = getChangedFields(originalData, form, fieldsToExclude);
      if (changedFields.length > 0) {
        console.log("Changed fields:", changedFields);
      }
      if (logoChanged) {
        console.log("Logo changed");
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "logoFile" && form.logoFile) {
          formData.append("logo", form.logoFile);
        } else if (key === "officeLocations") {
          form.officeLocations.forEach((loc) => {
            formData.append("officeLocations", loc);
          });
        }
        else if (key !== "logo" && key !== "logoFile") {
          formData.append(key, form[key]);
        }
      });

      const response = await api.put("/org/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if(response?.data && response?.data.success === true) {
        toast.success("Profile updated successfully");
        await dispatch(getOrgData());
        await dispatch(getCurrentUser());
        getProfileData();
      }

    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setEditMode(false);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(originalData);
    setEditMode(false);
  };

  const getProfileData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/org/profile");
      if(response?.data && response?.data.success === true) {
        let data  = response?.data?.data;
        const profileData = {...data, orgName: data.org.name, email: data.org.email};
        setForm(profileData);
        setOriginalData(profileData); // Store original data for comparison
      }
    } catch (error) {
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  if(loading === true) {
    return <Loader />
  }

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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <BusinessIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Organization Profile
          </Typography>
        </Box>

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
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              size="large"
            >
              Save Changes
            </Button>

            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={saving}
              size="large"
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Sections */}
      <BasicInfo form={form} editMode={editMode} handleChange={handleChange} />
      <CompanyDetails form={form} editMode={editMode} handleChange={handleChange} />
      <AddressInfo form={form} editMode={editMode} handleChange={handleChange} />
      <TaxLegalInfo form={form} editMode={editMode} handleChange={handleChange} />
      <BankInfo form={form} editMode={editMode} handleChange={handleChange} />
      <PayrollFinanceInfo form={form} editMode={editMode} handleChange={handleChange} />

    </Box>
  );
};

export default Profile;
