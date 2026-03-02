import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  console.log('allowedRoles: ', allowedRoles);
  const token = localStorage.getItem("token");
  const location = useLocation();

  //  No token
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      toast.error("Your session has expired. Please log in again.");
      return <Navigate to="/login" replace />;
    }

    const userRole = decoded.role;
    console.log('userRole: ', userRole);

    if (allowedRoles.length && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;