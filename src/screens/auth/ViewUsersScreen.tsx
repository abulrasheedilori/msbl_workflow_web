import { useEffect, useState } from "react";
import { enableOrDisableUser, getAllUsers } from "../../store/apiService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import AssignRolesScreen from "./AssignRolesScreen";
import ResetPwdScreen from "./ResetPwdScreen";

const ViewUsersScreen = () => {
  const [showResetPopUp, setShowResetPopUp] = useState(false);
  const [showAssignRolePopUp, setShowAssignRolePopUp] = useState(false);

  const dispatch = useAppDispatch();
  const { listOfUser, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, user]);

  const handleEnableOrDisabledUser = (email: string, isDisabled: boolean) => {
    const request = { email, isDisabled };
    dispatch(enableOrDisableUser(request)).then(() => dispatch(getAllUsers()));
  };

  const handleShowResetPopUp = () => {
    setShowResetPopUp(true);
  };
  const handleCloseResetPopUp = () => {
    setShowResetPopUp(false);
  };
  const handleShowAssignRolePopUp = () => {
    setShowAssignRolePopUp(true);
  };
  const handleCLoseAssignRolePopUp = () => {
    setShowAssignRolePopUp(false);
  };

  return (
    <section className="w-full h-full p-2 lg:w-[85vw] lg:p-8">
      <header className="text-xl font-bold lg:pt-8 lg:text-4xl">
        Manage Users
      </header>
      <p className="mt-4 mb-8 text-xs lg:text-lg">
        You can manage all users, change password, re-assign roles and
        disable/enable users here.
      </p>
      <section className="w-full overflow-auto">
        <table className="w-auto">
          <thead>
            <tr className="flex flex-row justify-between p-4 text-center text-white bg-slate-500">
              <th className="w-4 size-fit">ID</th>
              <th className="w-16 size-fit">Username</th>
              <th className="w-36 size-fit"> Full Name</th>
              {user?.roles.includes("ROLE_ADMIN") && (
                <th className="w-16 size-fit">Password</th>
              )}
              <th className="w-24 size-fit">Roles</th>
              {user?.roles.includes("ROLE_ADMIN") && (
                <th className="w-16 text-center size-fit">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {listOfUser
              .filter((user) => !user.roles.includes("ROLE_ADMIN"))
              .map((user_, index) => (
                <tr
                  key={user_.id?.toString()}
                  className="flex flex-row gap-4 p-4 my-1 text-center shadow-sm lg:gap-8 hover:bg-green-300"
                >
                  <td className="w-4 size-fit">{index + 1}</td>
                  <td className="w-16 size-fit">{user_.username}</td>
                  <td className="w-36 size-fit">
                    {user_.firstname + " " + user_.lastname}
                  </td>
                  {user?.roles.includes("ROLE_ADMIN") && (
                    <td
                      className="w-16 text-center size-fit"
                      onClick={handleShowResetPopUp}
                    >
                      <span className="text-sm font-semibold text-yellow-700 hover:underline hover:text-md">
                        Change
                      </span>
                    </td>
                  )}
                  <td
                    className="w-24 size-fit"
                    onClick={
                      user?.roles.includes("ROLE_SUPERVISOR")
                        ? handleShowAssignRolePopUp
                        : () => null
                    }
                  >
                    {user_.roles.map((role) => (
                      <div>
                        <p className="text-sm hover:text-sm">{role.slice(5)}</p>
                        <p className="text-xs text-center text-red-500 hover:underline">
                          re-assign
                        </p>
                      </div>
                    ))}
                  </td>
                  {user?.roles.includes("ROLE_ADMIN") && (
                    <td
                      className="w-16 text-sm text-center size-fit hover:text:md"
                      onClick={() =>
                        handleEnableOrDisabledUser(
                          user_.email,
                          !user_.isDisabled
                        )
                      }
                    >
                      <p
                        className={`${
                          user_.isDisabled ? "text-green-600" : "text-red-600"
                        } font-bold `}
                      >
                        {user_.isDisabled ? "ENABLED" : "DISABLED"}
                      </p>
                      <p className="text-xs text-red-500 hover:underline">
                        {!user_.isDisabled ? "enable" : "disable"}
                      </p>
                    </td>
                  )}
                  {showResetPopUp && (
                    <ResetPwdScreen
                      email={user_.email}
                      close={handleCloseResetPopUp}
                    />
                  )}
                  {showAssignRolePopUp && (
                    <AssignRolesScreen
                      email={user_.email}
                      close={handleCLoseAssignRolePopUp}
                    />
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default ViewUsersScreen;
