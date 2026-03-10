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

const steps = [
  "Version & Cycle",
  "Salary Structure",
  "Overtime & Bonus",
  "Statutory Deductions",
  "Loan & Advance"
];

const PayrollSettings = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [settings, setSettings] = useState({
    // Version Tracking
    version: 1,
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: null,
    isActive: true,
    
    // Payroll Cycle
    payrollCycle: "monthly",
    payrollStartDay: 1,
    payrollEndDay: 31,
    paymentDate: 5,
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

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // API call here
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PayrollCycleConfig settings={settings} handleChange={handleChange} />
          </Box>
        );
      case 1:
        return <SalaryStructure settings={settings} handleChange={handleChange} />;
      case 2:
        return <OvertimeBonus settings={settings} handleChange={handleChange} />;
      case 3:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 1.5, color: 'error.main', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Statutory Deductions & Compliance
              </Typography>
            </Box>
            <StatutoryDeductions settings={settings} handleChange={handleChange} />
          </Box>
        );
      case 4:
        return <LoanAdvance settings={settings} handleChange={handleChange} />;
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
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 1 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
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
              size="large"
              startIcon={<SaveIcon />}
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
