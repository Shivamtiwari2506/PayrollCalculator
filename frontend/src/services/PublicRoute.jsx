import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Outlet />;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp > currentTime) {
      return <Navigate to="/dashboard" replace />;
    }

    localStorage.removeItem("token");
    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    return <Outlet />;
  }
};

export default PublicRoute;