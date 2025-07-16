import { toast } from "react-toastify";

export const showValidationErrors = (errors) => {
  if (errors.length === 0) return true;

  // Show first error as main toast
  toast.error(errors[0], {
    duration: 4000,
    position: 'top-right',
  });

  return false;
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Custom toast styles