import api from "../store/apiService";
import { AuthState } from "./reducers/authSlice";
import store from "./store";

api.interceptors.request.use(async (config) => {
  const state = store.getState().auth as AuthState;
  const userString = localStorage.getItem("user");
  const user = userString && JSON.parse(userString);
  if (new Date().getTime() / 1000 > user.expires!) {
    const response = await api.post("/auth/refreshToken", {
      refreshToken: user.refreshToken,
    });
    if (state.user) {
      state.user.accessToken = response.data.data;
    }
    user.accessToken = response.data.data;
    const stringifiedUser = JSON.stringify(user);
    localStorage.setItem("user", stringifiedUser);
  }
  return config;
});

export default api;
