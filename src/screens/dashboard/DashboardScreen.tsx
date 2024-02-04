import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/reducers/authSlice";

type RouteType =
  | "VIEW_REQUEST"
  | "CREATE_REQUEST"
  | "LOGOUT"
  | "AUDIT"
  | "CREATE_USER"
  | "MANAGE_USER";

const DashboardScreen: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedRoute, setSelectedRoute] = useState<RouteType>(
    `${
      user && !user.roles[0].includes("ADMIN") ? "VIEW_REQUEST" : "MANAGE_USER"
    }`
  );
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useAppDispatch();

  const handleSelectedRoute = (route: RouteType) => {
    setSelectedRoute(route);
    setShowMenu(false);
  };
  const logUserOut = () => {
    dispatch(logout());
  };

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <section className="w-screen h-screen">
      <section className=" w-full h-[10vh] bg-green-950 flex flex-row justify-between items-center">
        <img
          src={require("../../asset/images/meristem_name_logo.png")}
          alt=""
          className="bg-green-200 w-50 h-5 lg:w-[200px] lg:h-12 rounded-xl shadow-md m-1 lg:m-8 animate-bounce"
        />
        <span className="hidden font-bold text-center text-white lg:p-8 lg:text-5xl lg:flex">
          MSBL DASHBOARD
        </span>
        {showMenu ? (
          <IoClose
            size={36}
            color="red"
            className="mx-2 lg:hidden"
            onClick={handleCloseMenu}
          />
        ) : (
          <IoMdMenu
            size={36}
            color="green"
            className="mx-2 lg:hidden"
            onClick={handleShowMenu}
          />
        )}

        <section className="hidden h-[50px] lg:flex flex-row justify-center item-center">
          <section className="flex flex-col items-center justify-center">
            <span className="mr-4 text-center text-green-50">
              Welcome {user && user.firstname}
            </span>
            <span className="p-1 mr-4 text-center border-2 border-green-700 rounded-md text-green-50">
              {user && user.roles[0].slice(5)}
            </span>
          </section>
          <FaUser size={48} className="mr-8 text-green-100" />
        </section>
      </section>
      <section className="relative flex w-full h-[90vh] lg:flex-row bg-green-50">
        <nav
          className={`${
            !showMenu && "hidden lg:flex"
          } absolute top-0 right-0 lg:static lg:w-[15vw] md:h-[90vh] bg-green-200 p-2 shadow-md z-50`}
        >
          <ul className="flex flex-col w-full gap-1">
            {user && !user.roles.includes("ROLE_ADMIN") && (
              <Link
                to="/dashboard"
                onClick={() => handleSelectedRoute("VIEW_REQUEST")}
                className={`border border-green-300 hover:bg-green-900 hover:text-white p-2 rounded-md ${
                  selectedRoute === "VIEW_REQUEST" && "bg-green-900 text-white"
                }`}
              >
                View Requests
              </Link>
            )}
            {user && user.roles.includes("ROLE_INITIATOR") && (
              <Link
                to="/dashboard/create-request"
                onClick={() => handleSelectedRoute("CREATE_REQUEST")}
                className={`border border-green-300 hover:bg-green-900 hover:text-white p-2 rounded-md ${
                  selectedRoute === "CREATE_REQUEST" &&
                  "bg-green-900 text-white"
                }`}
              >
                Create Request
              </Link>
            )}
            {user &&
              (user.roles.includes("ROLE_ADMIN") ||
                user.roles.includes("ROLE_SUPERVISOR")) && (
                <Link
                  to="/dashboard/manage-user"
                  onClick={() => handleSelectedRoute("MANAGE_USER")}
                  className={`border border-green-300 hover:bg-green-900 hover:text-white p-2 rounded-md ${
                    selectedRoute === "MANAGE_USER" && "bg-green-900 text-white"
                  }`}
                >
                  Manage Users
                </Link>
              )}

            {user && user.roles[0] === "ROLE_ADMIN" && (
              <Link
                to="/dashboard/create-user"
                onClick={() => handleSelectedRoute("CREATE_USER")}
                className={`border border-green-300 hover:bg-green-900 hover:text-white p-2 rounded-md ${
                  selectedRoute === "CREATE_USER" && "bg-green-900 text-white"
                }`}
              >
                Create User
              </Link>
            )}

            <Link
              to="/dashboard/audit"
              onClick={() => handleSelectedRoute("AUDIT")}
              className={`border border-green-300 hover:bg-green-900 hover:text-white p-2 rounded-md ${
                selectedRoute === "AUDIT" && "bg-green-900 text-white"
              }`}
            >
              Audit Request
            </Link>

            <Link
              to="/"
              onClick={() => logUserOut()}
              className={`border border-green-300 hover:bg-green-900 hover:text-white p-2 rounded-md ${
                selectedRoute === "LOGOUT" && "bg-green-900 text-white"
              }`}
            >
              Log Out
            </Link>
          </ul>
        </nav>
        <Outlet />
      </section>
    </section>
  );
};

export default DashboardScreen;
