import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export const checkTokenValidity = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return { isValid: false, shouldRedirect: false };
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('org');
      toast.error('Your session has expired. Please log in again.');
      return { isValid: false, shouldRedirect: true };
    }

    return { isValid: true, shouldRedirect: false };
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { isValid: false, shouldRedirect: false };
  }
};
