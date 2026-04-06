import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Step,
    StepLabel,
    Stepper,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const PayrollModal = ({
    loading,
    showPayrollModal,
    handleClose,
    steps,
    activeStep,
    isEditMode = false,
    handleSave,
    handleNext,
    handleBack,
    getStepContent,
}) => {
    return (
        <Dialog
            open={showPayrollModal}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                <ReceiptLongIcon sx={{ color: 'warning.main' }} />
                {isEditMode ? 'Update Payroll Settings' : 'Create Payroll Settings'}
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 2 }}>
                {/* Alert */}
                <Alert severity="info" sx={{ mb: 3 }} icon={<InfoOutlinedIcon />}>
                    Changes to payroll settings will apply from the next payroll cycle.
                    Current cycle will use existing settings.
                </Alert>

                {/* Stepper */}
                <Paper
                    elevation={2}
                    sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 1, overflowX: 'auto' }}
                >
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ minWidth: '500px' }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>

                {/* Step Content */}
                <Box>{getStepContent(activeStep)}</Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
                {/* Left */}
                <Button variant="outlined" color="error" onClick={handleClose} size="large">
                    Cancel
                </Button>

                {/* Right */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<NavigateBeforeIcon />}
                        size="large"
                    >
                        Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            disabled={loading}
                            size="large"
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            onClick={handleSave}
                        >
                            {isEditMode ? 'Update Settings' : 'Save Settings'}
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
            </DialogActions>
        </Dialog>
    );
};

export default PayrollModal;
