import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useNetworkStatus from "./hooks/useNetworkStatus";
import "./index.css";
import { showToast } from "./middlewares/showToast";
import CreateUser from "./screens/auth/CreateUser";
import ViewUsersScreen from "./screens/auth/ViewUsersScreen";
import Toast from "./screens/components/Toast";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import Homepage from "./screens/homepage/Homepage";
import CreateRequest from "./screens/request/CreateRequest";
import EditRequest from "./screens/request/EditRequest";
import ViewRequest from "./screens/request/ViewRequest";
import ViewRequestFull from "./screens/request/ViewRequestFull";
import RequestTable from "./screens/review/RequestTable";
import { LoginResponse } from "./store/apiTypes";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { updateIsAuthenticated } from "./store/reducers/authSlice";
import { isAuthenticated, retrieveCacheData } from "./utils/helperFunctions";

const App = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<LoginResponse>();
  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);
  const isOnline = useNetworkStatus();
  const dispatch = useAppDispatch();

  useEffect(
    React.useCallback(() => {
      if (!isOnline) {
        showToast("error", "Internet is off", 500);
      }
    }, [])
  );

  useEffect(() => {
    setUser(retrieveCacheData("user"));
    const updated = isAuthenticated();
    if (updated) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    dispatch(updateIsAuthenticated(updated));
  }, [isLoggedIn]);

  return (
    <section>
      <Toast />
      <BrowserRouter>
        <Routes>
          {!isAuth ? (
            <Route path="/" element={<Homepage />} />
          ) : (
            <Route path="/" element={<Navigate to="/dashboard" />} />
          )}

          {isAuth && (
            <Route path="dashboard" element={<DashboardScreen />}>
              {user && !user.roles.includes("ROLE_ADMIN") ? (
                <Route index element={<ViewRequest />} />
              ) : (
                <Route index element={<ViewUsersScreen />} />
              )}

              {user && !user.roles.includes("ROLE_ADMIN") && (
                <Route path="/dashboard/:id" element={<ViewRequestFull />} />
              )}

              <Route path="create-request" element={<CreateRequest />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="manage-user" element={<ViewUsersScreen />} />
              <Route path="audit" element={<RequestTable />} />
              <Route path="edit-request" element={<EditRequest />} />
              <Route path=":id/edit-request" element={<EditRequest />} />
              {/* New nested route */}
            </Route>
          )}
          <Route path="*" element={<Homepage />} />

          <Route path="/" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </section>
  );
};

export default App;
