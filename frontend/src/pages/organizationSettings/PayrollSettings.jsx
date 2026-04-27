import { useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import PayrollCycleConfig from "../../components/organizations/payrollSettings/PayrollCycleConfig";
import SalaryStructure from "../../components/organizations/payrollSettings/SalaryStructure";
import OvertimeBonus from "../../components/organizations/payrollSettings/OvertimeBonus";
import StatutoryDeductions from "../../components/organizations/payrollSettings/StatutoryDeductions";
import LoanAdvance from "../../components/organizations/payrollSettings/LoanAdvance";
import SavedPayrollSettings from "../../components/organizations/payrollSettings/SavedPayrollSettings";
import RunPayrollModal from "../../components/organizations/payrollSettings/RunPayrollModal";
import PayrollRunsTable from "../../components/organizations/payrollSettings/PayrollRunsTable";
import api from "../../services/api";
import { toast } from "react-toastify";
import { handleApiError } from "../../utils/commonFunctions/errorHandler";
import { useEffect } from "react";
import PayrollModal from "../../components/organizations/payrollSettings/PayrollModal";
import Loader from "../../utils/Loader";

const steps = [
  "Version & Cycle",
  "Salary Structure",
  "Overtime & Bonus",
  "Statutory Deductions",
  "Loan & Advance"
];

const resetSettings = {
  effectiveFrom: null,
  effectiveTo: null,

  // Payroll Cycle
  payrollCycle: "monthly",
  cycleConfig: {
    payrollStartDay: 1,
    payrollEndDay: 31,
    paymentDate: 5
  },
  workingDaysPerMonth: 26,
  weekendDays: ["Saturday", "Sunday"],

  // Salary Structure
  basicPercent: 50.0,
  hraPercent: 40.0,
  allowancePercent: 10.0,

  // Overtime
  overtimeEnabled: true,
  overtimeRate: 1.5,
  overtimeCalculation: "hourly",

  // Statutory Deductions
  pfEnabled: true,
  pfPercent: 12.0,
  pfEmployerContribution: 12.0,
  pfCeiling: 15000,

  esiEnabled: true,
  esiPercent: 0.75,
  esiEmployerPercent: 3.25,
  esiCeiling: 21000,

  gratuityEnabled: true,
  gratuityYears: 5,

  professionalTaxEnabled: true,
  professionalTaxAmount: 200,

  tdsEnabled: true,

  // Bonus & Incentives
  bonusEnabled: true,
  bonusMonth: "March",
  performanceBonusEnabled: true,

  // Leave Encashment
  leaveEncashmentEnabled: true,
  maxEncashmentDays: 30,

  // Loan & Advance
  loanEnabled: true,
  maxLoanAmount: 100000,
  advanceEnabled: true,
  maxAdvanceAmount: 50000,
}

const formatDate = (date) => {
  return date ? date.split("T")[0] : "";
};

const PayrollSettings = () => {
  const [loading, setLoading] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [configsLoading, setConfigsLoading] = useState(false);
  const [configsError, setConfigsError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewSavedConfig, setViewSavedConfig] = useState(false);

  // Payroll runs state
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [runsLoading, setRunsLoading] = useState(false);
  const [runsError, setRunsError] = useState(null);

  const fetchSavedConfigs = async () => {
    setConfigsLoading(true);
    setConfigsError(null);
    try {
      const response = await api.get('/payroll/settings');
      if (response?.data && response?.data?.success === true) {
        setSavedConfigs(response.data.data ?? []);
      }
    } catch (error) {
      setConfigsError("Failed to load saved configurations.");
    } finally {
      setConfigsLoading(false);
    }
  };

  const fetchPayrollRuns = async () => {
    setRunsLoading(true);
    setRunsError(null);
    try {
      const res = await api.get('/payroll/run');
      if (res?.data?.success) setPayrollRuns(res.data.data ?? []);
    } catch {
      setRunsError("Failed to load payroll run history.");
    } finally {
      setRunsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedConfigs();
    fetchPayrollRuns();
  }, []);

  const [errors, setErrors] = useState({});
  const [settings, setSettings] = useState(resetSettings);

  const validateStep = (step) => {
    let newErrors = {};

    switch (step) {

      // STEP 0: Payroll Cycle
      case 0:
        if (!settings.payrollCycle) {
          newErrors.payrollCycle = "Payroll cycle is required";
        }
        if (settings.payrollCycle === "monthly") {
          if (!settings.cycleConfig?.payrollStartDay || settings.cycleConfig?.payrollStartDay < 1 || settings.cycleConfig?.payrollStartDay > 31) {
            newErrors["cycleConfig.payrollStartDay"] = "Start day must be between 1-31";
          }
          if (!settings.cycleConfig?.payrollEndDay || settings.cycleConfig?.payrollEndDay < 1 || settings.cycleConfig?.payrollEndDay > 31) {
            newErrors["cycleConfig.payrollEndDay"] = "End day must be between 1-31";
          }
          if (!settings.cycleConfig?.paymentDate || settings.cycleConfig?.paymentDate < 1 || settings.cycleConfig?.paymentDate > 31) {
            newErrors["cycleConfig.paymentDate"] = "Payment date must be between 1-31";
          }
        } else if (settings.payrollCycle === "weekly" || settings.payrollCycle === "biweekly") {
          if (!settings.cycleConfig?.payrollStartDay) {
            newErrors["cycleConfig.payrollStartDay"] = "Start day is required";
          }
          if(settings.cycleConfig?.payrollStartDay!==null && settings.cycleConfig?.payrollEndDay!==null && settings.cycleConfig?.payrollStartDay === settings.cycleConfig?.payrollEndDay) {
            newErrors["cycleConfig.payrollEndDay"] = "Start day and end day cannot be the same";
          }
          if (settings.payrollCycle !== "biweekly" && !settings.cycleConfig?.payrollEndDay) {
            newErrors["cycleConfig.payrollEndDay"] = "End day is required";
          }
          if (!settings.cycleConfig?.paymentDate) {
            newErrors["cycleConfig.paymentDate"] = "Payment date is required";
          }
        }
        if (!settings.workingDaysPerMonth || settings.workingDaysPerMonth < 20 || settings.workingDaysPerMonth > 31) {
          newErrors.workingDaysPerMonth = "Payment date must be between 20-31";
        }
        if (!settings.weekendDays || settings.weekendDays.length === 0) {
          newErrors.weekendDays = "Weekend days are required";
        }
        if (!settings.effectiveFrom) {
          newErrors.effectiveFrom = "Effective date is required";
        }
        break;

      // STEP 1: Salary Structure
      case 1:
        if (!settings.basicPercent) {
          newErrors.basicPercent = "Basic is required";
        }
        if (settings.basicPercent <= 0) {
          newErrors.basicPercent = "Basic % must be > 0";
        }
        if (!settings.hraPercent) {
          newErrors.hraPercent = "HRA is required";
        } else if (settings.hraPercent < 0) {
          newErrors.hraPercent = "HRA % cannot be negative";
        }
        if (!settings.allowancePercent) {
          newErrors.allowancePercent = "Allowance is required";
        }
        if (settings.allowancePercent < 0) {
          newErrors.allowancePercent = "Allowance % cannot be negative";
        }

        const total =
          Number(settings.basicPercent) +
          Number(settings.hraPercent) +
          Number(settings.allowancePercent);

        if (total !== 100) {
          newErrors.totalPercent = "Total must be 100%";
        }
        break;

      // STEP 2: Overtime & Bonus
      case 2:
        if (settings.overtimeEnabled) {
          if (!settings.overtimeRate || settings.overtimeRate <= 0) {
            newErrors.overtimeRate = "Overtime rate must be > 0";
          }
          if (!settings.overtimeCalculation) {
            newErrors.overtimeCalculation = "Select calculation type";
          }
        }

        if (settings.bonusEnabled && !settings.bonusMonth) {
          newErrors.bonusMonth = "Bonus month is required";
        }
        break;

      // STEP 3: Statutory Deductions
      case 3:
        if (settings.pfEnabled) {
          if (!settings.pfPercent) {
            newErrors.pfPercent = "PF % required";
          }
          if (!settings.pfEmployerContribution) {
            newErrors.pfEmployerContribution = "Employer PF required";
          }
          if (!settings.pfCeiling) {
            newErrors.pfCeiling = "PF Ceiling required";
          }
        }

        if (settings.esiEnabled) {
          if (!settings.esiPercent) {
            newErrors.esiPercent = "ESI % required";
          }
          if (!settings.esiEmployerPercent) {
            newErrors.esiEmployerPercent = "Employer ESI required";
          }
          if (!settings.esiCeiling) {
            newErrors.esiCeiling = "ESI Ceiling amount required";
          }
        }

        if (settings.gratuityEnabled && (!settings.gratuityYears || settings.gratuityYears <= 0)) {
          newErrors.gratuityYears = "Years must be > 0";
        }
        if (settings.leaveEncashmentEnabled && (!settings.maxEncashmentDays || settings.maxEncashmentDays <= 0)) {
          newErrors.maxEncashmentDays = "Max days must be > 0";
        }

        if (settings.professionalTaxEnabled && !settings.professionalTaxAmount) {
          newErrors.professionalTaxAmount = "Tax amount required";
        }
        break;

      // STEP 4: Loan & Advance
      case 4:
        if (settings.loanEnabled && (!settings.maxLoanAmount || settings.maxLoanAmount <= 0)) {
          newErrors.maxLoanAmount = "Loan amount must be > 0";
        }

        if (settings.advanceEnabled && (!settings.maxAdvanceAmount || settings.maxAdvanceAmount <= 0)) {
          newErrors.maxAdvanceAmount = "Advance amount must be > 0";
        }
        break;

      default:
        break;
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    if (field.startsWith("cycleConfig.")) {
      const key = field.split(".")[1];
      setSettings(prev => ({
        ...prev,
        cycleConfig: {
          ...prev.cycleConfig,
          [key]: value
        }
      }))
    }
    else {
      if (field === "payrollCycle") {
        if (value === "biweekly") {
          setSettings(prev => ({
            ...prev,
            cycleConfig: {
              payrollStartDay: "Monday",
              paymentDate: "Friday"
            }
          }))
        } else if (value === "monthly") {
          setSettings(prev => ({
            ...prev,
            cycleConfig: {
              ...prev.cycleConfig,
              payrollStartDay: 1,
              payrollEndDay: 31,
              paymentDate: 5
            }
          }))
        } else if (value === "weekly") {
          setSettings(prev => ({
            ...prev,
            cycleConfig: {
              ...prev.cycleConfig,
              payrollStartDay: "Monday",
              payrollEndDay: "Sunday",
              paymentDate: "Friday"
            }
          }))
        }
      }
      setSettings(prev => ({ ...prev, [field]: value }));
    };
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(activeStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payroll/settings', settings);
      if(response?.data && response?.data?.success === true) {
        toast.success("Payroll settings saved successfully");
        fetchSavedConfigs();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
      handleClose();
      setActiveStep(0);
      setSettings(resetSettings);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PayrollCycleConfig settings={settings} handleChange={handleChange} errors={errors} viewSavedConfig={viewSavedConfig}/>
          </Box>
        );
      case 1:
        return <SalaryStructure settings={settings} handleChange={handleChange} errors={errors} viewSavedConfig={viewSavedConfig} />;
      case 2:
        return <OvertimeBonus settings={settings} handleChange={handleChange} errors={errors} viewSavedConfig={viewSavedConfig} />;
      case 3:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 1.5, color: 'error.main', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Statutory Deductions & Compliance
              </Typography>
            </Box>
            <StatutoryDeductions settings={settings} handleChange={handleChange} errors={errors} viewSavedConfig={viewSavedConfig} />
          </Box>
        );
      case 4:
        return <LoanAdvance settings={settings} handleChange={handleChange} errors={errors} viewSavedConfig={viewSavedConfig}/>;
      default:
        return "Unknown step";
    }
  };

  const handleClose = () => {
    setViewSavedConfig(false);
    setShowPayrollModal(false);
    setSettings(resetSettings);
    setActiveStep(0);
  }

  const handleEdit = (config, type) => {
    setSettings({
      ...config,
      effectiveFrom: formatDate(config.effectiveFrom),
    effectiveTo: formatDate(config.effectiveTo)
    });
    setShowPayrollModal(true);
    if(type === 'View') {
      setViewSavedConfig(true);
    } else setIsEditMode(true);
  }

  const handleDelete = async (configId) => {
    return;
  }

  if(configsLoading === true) {
    return <Loader/>
  }

  return (
    <Box>
      {/* HEADER CARD */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ReceiptLongIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Payroll Configuration
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<PlayArrowIcon />}
            onClick={() => setShowRunModal(true)}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3 }}
          >
            Run Payroll
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Configure payroll cycles, salary structure, statutory compliances, and deductions
        </Typography>
      </Box>

      {/* SAVED CONFIG CARD */}
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        <SavedPayrollSettings
          setShowPayrollModal={setShowPayrollModal}
          configs={savedConfigs}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        {/* PAYROLL RUN HISTORY */}
        <PayrollRunsTable
          runs={payrollRuns}
          loading={runsLoading}
          error={runsError}
        />
      </Box>

      {/* RUN PAYROLL MODAL */}
      <RunPayrollModal
        open={showRunModal}
        onClose={() => setShowRunModal(false)}
        onSuccess={fetchPayrollRuns}
      />

      {/* MODAL */}
      <PayrollModal
        loading={loading}
        showPayrollModal={showPayrollModal}
        handleClose={handleClose}
        isEditMode={isEditMode}
        steps={steps}
        activeStep={activeStep}
        handleSave={handleSave}
        handleNext={handleNext}
        handleBack={handleBack}
        getStepContent={getStepContent}
        viewSavedConfig={viewSavedConfig}
        createdAt={settings?.createdAt ||null}
      />
    </Box>
  );
};

export default PayrollSettings;
