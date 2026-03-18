import { useState } from "react";
import {
  Box,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import PayrollCycleConfig from "../../components/organizations/payrollSettings/PayrollCycleConfig";
import SalaryStructure from "../../components/organizations/payrollSettings/SalaryStructure";
import OvertimeBonus from "../../components/organizations/payrollSettings/OvertimeBonus";
import StatutoryDeductions from "../../components/organizations/payrollSettings/StatutoryDeductions";
import LoanAdvance from "../../components/organizations/payrollSettings/LoanAdvance";
import api from "../../services/api";
import { toast } from "react-toastify";
import { handleApiError } from "../../utils/commonFunctions/errorHandler";

const steps = [
  "Version & Cycle",
  "Salary Structure",
  "Overtime & Bonus",
  "Statutory Deductions",
  "Loan & Advance"
];

const PayrollSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [settings, setSettings] = useState({
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: null,
    isActive: true,
    
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
  });

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
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PayrollCycleConfig settings={settings} handleChange={handleChange} errors={errors}/>
          </Box>
        );
      case 1:
        return <SalaryStructure settings={settings} handleChange={handleChange} errors={errors} />;
      case 2:
        return <OvertimeBonus settings={settings} handleChange={handleChange} errors={errors} />;
      case 3:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 1.5, color: 'error.main', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Statutory Deductions & Compliance
              </Typography>
            </Box>
            <StatutoryDeductions settings={settings} handleChange={handleChange} errors={errors} />
          </Box>
        );
      case 4:
        return <LoanAdvance settings={settings} handleChange={handleChange} errors={errors}/>;
      default:
        return "Unknown step";
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ReceiptLongIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Payroll Configuration
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Configure payroll cycles, salary structure, statutory compliances, and deductions
        </Typography>
      </Box>

      {/* Alert */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoOutlinedIcon />}>
        Changes to payroll settings will apply from the next payroll cycle. Current cycle will use existing settings.
      </Alert>

      {/* Stepper */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 1.5, sm: 3 },
          mb: 3,
          borderRadius: 1,
          overflowX: "auto"
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ minWidth: "500px" }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Box sx={{ mb: 4 }}>
        {getStepContent(activeStep)}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<NavigateBeforeIcon />}
          size="large"
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              disabled={loading}
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
            >
              Save Payroll Settings
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNextIcon />}
              size="large"
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PayrollSettings;
