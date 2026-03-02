import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  console.log(error.response);
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong';

  toast.error(message);
};