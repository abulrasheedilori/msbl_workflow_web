import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useNetworkStatus from "./hooks/useNetworkStatus";
import "./index.css";
import { showToast } from "./middlewares/Toast";
import CreateUser from "./screens/auth/CreateUser";
import ViewUsersScreen from "./screens/auth/ViewUsersScreen";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import Homepage from "./screens/homepage/Homepage";
import CreateRequest from "./screens/request/CreateRequest";
import EditRequest from "./screens/request/EditRequest";
import ViewRequest from "./screens/request/ViewRequest";
import ViewRequestFull from "./screens/request/ViewRequestFull";
import RequestTable from "./screens/review/RequestTable";
import { useAppSelector } from "./store/hooks";

const App = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.auth);

  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      showToast("error", "Your Internet is off", 2000);
    } else {
      showToast("success", "Great!, You back online", 1000);
    }
  }, [isOnline]);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    const parsedAuth = cachedUser && JSON.parse(cachedUser);
    setIsAuth(parsedAuth.accesstoken);
    console.log("Access token set, IsAuth = ", parsedAuth.accesstoken);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {isAuth ? (
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
        ) : (
          <Route path="*" element={<Homepage />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
