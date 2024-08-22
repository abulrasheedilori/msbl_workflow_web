import { ToastOptions, toast } from "react-toastify";

type ToastType = "success" | "info" | "warning" | "error";

export const showToast = (
  type: ToastType,
  message: string,
  duration?: number
) => {
  const options: ToastOptions = {
    position: "top-left",
    autoClose: duration || 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { borderRadius: 16, boxShadow: "revert-layer" }, // Default empty style
  };

  switch (type) {
    case "success":
      options.style = { backgroundColor: "deepgreen", color: "white" };
      toast.success(message, options);
      break;
    case "info":
      options.style = { backgroundColor: "yellow", color: "black" };
      toast.info(message, options);
      break;
    case "warning":
      options.style = { backgroundColor: "lightcoral", color: "white" };
      toast.warn(message, options);
      break;
    case "error":
      options.style = { backgroundColor: "red", color: "white" };
      toast.error(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};
