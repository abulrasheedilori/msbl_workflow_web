import axios from "axios";
import { showToast } from "../middlewares/showToast";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: process.env.REACT_APP_LOCAL_BASE_URL,
  timeout: 60000,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error?.response?.request?.status === 401 ||
      error?.response?.request?.status === "401" ||
      error?.response?.status === 401 ||
      error?.response?.status === "401"
    ) {
      showToast(
        "error",
        error?.response?.data?.message || "Unauthorized, Kindly Login in",
        500
      );
      localStorage.clear();

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
