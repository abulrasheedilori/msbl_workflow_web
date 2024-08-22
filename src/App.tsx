import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { useAppSelector } from "./store/hooks";
import { retrieveCacheData } from "./utils/helperFunctions";

const App = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.auth);

  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      showToast("error", "Your Internet is off", 1000);
    }
  }, [isOnline]);

  useEffect(() => {
    const user = retrieveCacheData("user");
    if (user.accessToken) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  return (
    <section>
      <Toast />
      <BrowserRouter>
        <Routes>
          {isAuth ? (
            <Route path="dashboard" element={<DashboardScreen />}>
              <Route
                index
                element={
                  user && !user.roles.includes("ROLE_ADMIN") ? (
                    <ViewRequest />
                  ) : (
                    <ViewUsersScreen />
                  )
                }
              />
              <Route path="create-request" element={<CreateRequest />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="manage-user" element={<ViewUsersScreen />} />
              <Route path="audit" element={<RequestTable />} />
              <Route path="edit-request" element={<EditRequest />} />
              <Route path=":id/edit-request" element={<EditRequest />} />
              <Route path=":id" element={<ViewRequestFull />} />
            </Route>
          ) : (
            <Route path="*" element={<Homepage />} />
          )}
        </Routes>
      </BrowserRouter>
    </section>
  );
};

export default App;
