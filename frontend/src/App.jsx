import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { Bounce, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
//component imports
import NotFound from './utils/NotFound';
import LoginChoice from './pages/LoginChoice';
import UserLogin from './pages/UserLogin';
import OrganizationLogin from './pages/OrganizationLogin';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import ProtectedRoute from "./services/ProtectedRoute";
import { ROLES } from "./utils/commonFunctions/helpers";
import AuthLayout from './layout/AuthLayout';
import AppLayout from './layout/AppLayout';
import Profile from './pages/organizationSettings/Profile';
import PayrollSettings from './pages/organizationSettings/PayrollSettings';
import LeaveAttendence from './pages/organizationSettings/LeaveAttendence';
import UserRoles from './pages/organizationSettings/UserRoles';
import Payslip from './pages/organizationSettings/Payslip';
import Notifications from './pages/organizationSettings/Notifications';
import { checkTokenValidity } from './utils/commonFunctions/checkTokenValidity';
import IncomeTaxSlabs from './pages/organizationSettings/IncomeTaxSlabs';

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const { isValid, shouldRedirect } = checkTokenValidity();
    console.log('isValid: ', isValid, "shouldRedirect", shouldRedirect);
    const currentPath = window.location.pathname;
    
    // If on root path, redirect based on token validity
    if (currentPath === '/') {
      if (isValid === true) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } else if (shouldRedirect === true) {
      // Token expired while on other routes
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Root redirect - handled by useEffect above */}
      <Route path="/" element={null} />

      {/* Public routes with AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginChoice />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/organization" element={<OrganizationLogin />} />
      </Route>

      {/* Private routes with AppLayout */}
      <Route element={<AppLayout />}>
        {/* Dashboard → all logged users */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.ORG_ADMIN, ROLES.USER]}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Settings → Admin only */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />
          }
        >
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/income-tax" element={<IncomeTaxSlabs />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ORG_ADMIN]} />}>
          <Route path="/org-settings/profile" element={<Profile />} />
          <Route path="/org-settings/payroll" element={<PayrollSettings />} />
          <Route path="/org-settings/leave" element={<LeaveAttendence />} />
          <Route path="/org-settings/employees" element={<UserRoles />} />
          <Route path="/org-settings/payslip" element={<Payslip />} />
          <Route path="/org-settings/notifications" element={<Notifications />} />
        </Route>
      </Route>
      
      {/* 404 - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;