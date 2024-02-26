import { useEffect, useState } from "react";
import { enableOrDisableUser, getAllUsers } from "../../store/apiService";
import User, { UserUpdate } from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import AssignRolesScreen from "./AssignRolesScreen";
import ChangeUserDetails from "./ChangeUserDetails";
import ResetPwdScreen from "./ResetPwdScreen";

const ViewUsersScreen = () => {
  const [showResetPopUp, setShowResetPopUp] = useState(false);
  const [showAssignRolePopUp, setShowAssignRolePopUp] = useState(false);
  const [targetedUserEmail, setTargetedUserEmail] = useState("");
  const [showUserDetailPopUp, setShowUserDetailPopUp] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserUpdate | null>(null);

  const dispatch = useAppDispatch();
  const { listOfUser, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, user]);

  const handleEnableOrDisabledUser = (email: string, isDisabled: boolean) => {
    const request = { email, isDisabled };
    dispatch(enableOrDisableUser(request)).then(() => dispatch(getAllUsers()));
  };

  const handleShowUserDetailPopUp = (id: number, user: User) => {
    const { username, firstname, lastname, mobile } = user && user;
    console.log("PROPS FOR USERUPDATE = ", user);
    if (!id) return;
    const userReq: UserUpdate = {
      userId: id,
      username,
      mobile,
      firstname,
      lastname,
    };
    setSelectedUser(userReq);
    setShowUserDetailPopUp(true);
  };

  const handleShowResetPopUp = (email: string) => {
    setTargetedUserEmail(email); // Set the targeted user's email
    setShowResetPopUp(true);
  };
  const handleCloseResetPopUp = () => {
    setShowResetPopUp(false);
  };
  const handleShowAssignRolePopUp = (email: string) => {
    setTargetedUserEmail(email); // Set the targeted user's email
    setShowAssignRolePopUp(true);
  };
  const handleCLoseAssignRolePopUp = () => {
    setShowAssignRolePopUp(false);
  };

  return (
    <section className="w-full h-full lg:w-[85vw] lg:h-[90vh] p-8 border-4 ">
      <header className="text-xl font-bold lg:pt-8 lg:text-4xl">
        Manage Users
      </header>
      <p className="mt-4 mb-8 text-xs lg:text-lg">
        You can manage all users, change password, re-assign roles and
        disable/enable users here.
      </p>
      <section className="w-full h-[70vh] overflow-auto">
        <table className="mx-auto bg-white border border-gray-300">
          <thead className="sticky top-0 ">
            <tr className="border border-gray-300 bg-slate-50 text-wrap">
              <th className="flex-1 px-2 py-1">ID</th>
              <th className="px-2 py-1 flex-6">Username</th>
              <th className="px-2 py-1 flex-6">Full Name</th>
              <th className="px-2 py-1 flex-6">Email</th>
              {user?.roles.includes("ROLE_ADMIN") && (
                <th className="flex-1 px-2 py-1 ">Password</th>
              )}
              <th className="flex-1 px-2 py-1 ">Roles</th>
              {user?.roles.includes("ROLE_ADMIN") && (
                <th className="flex-1 px-2 py-1">Actions</th>
              )}
              {user?.roles.includes("ROLE_ADMIN") && (
                <th className="flex-1 px-2 py-1 ">Update Details</th>
              )}
            </tr>
          </thead>
          <tbody>
            {listOfUser.length > 0 ? (
              listOfUser
                .filter((user) => !user.roles.includes("ROLE_ADMIN"))
                .map((user_, index) => (
                  <tr
                    key={user_?.id?.toString()}
                    className="text-center border-b bg-slate-50 text-nowrap hover:bg-green-900 hover:text-green-50"
                  >
                    <td className="flex-1 px-2 py-1">{index + 1}</td>
                    <td className="px-2 py-1 tex-wrap flex-3">
                      {user_?.username}
                    </td>
                    <td className="px-2 py-1 text-wrap flex-3">
                      {user_?.firstname + " " + user_.lastname}
                    </td>
                    <td className="px-2 py-1 text-wrap flex-3">
                      {user_?.email}
                    </td>
                    {user?.roles.includes("ROLE_ADMIN") && (
                      <td
                        className="flex-1 px-2 py-1 "
                        onClick={() => handleShowResetPopUp(user_?.email)}
                      >
                        <span className="flex-1 px-2 py-1 text-sm font-semibold text-center text-yellow-700 hover:underline hover:text-md">
                          Change
                        </span>
                      </td>
                    )}
                    <td
                      className="flex-1 px-2 py-1 "
                      onClick={
                        user?.roles.includes("ROLE_SUPERVISOR")
                          ? () => handleShowAssignRolePopUp(user_?.email)
                          : () => null
                      }
                    >
                      {user_.roles.map((role) => (
                        <div className="flex-1 px-2 py-1 ">
                          <p className="text-sm hover:text-sm">
                            {role.slice(5)}
                          </p>
                          {user?.roles.includes("ROLE_SUPERVISOR") && (
                            <p className="text-xs text-center text-red-500 hover:underline">
                              re-assign
                            </p>
                          )}
                        </div>
                      ))}
                    </td>
                    {user?.roles.includes("ROLE_ADMIN") && (
                      <td
                        className="flex-1 px-2 py-1 text-sm hover:text:md"
                        onClick={() =>
                          handleEnableOrDisabledUser(
                            user_?.email,
                            !user_?.isDisabled
                          )
                        }
                      >
                        <p
                          className={`${
                            user_.isDisabled ? "text-green-600" : "text-red-600"
                          } font-bold `}
                        >
                          {user_?.isDisabled ? "ENABLED" : "DISABLED"}
                        </p>
                        <p className="text-xs text-red-500 hover:underline">
                          {!user_?.isDisabled ? "enable" : "disable"}
                        </p>
                      </td>
                    )}
                    {user?.roles.includes("ROLE_ADMIN") && (
                      <td
                        className="flex-1 px-2 py-1 "
                        onClick={() =>
                          handleShowUserDetailPopUp(user_.id!, user_)
                        }
                      >
                        <span className="flex-1 px-2 py-1 text-sm font-semibold text-center text-yellow-700 hover:underline hover:text-md">
                          update user
                        </span>
                      </td>
                    )}
                    {showResetPopUp && (
                      <ResetPwdScreen
                        email={targetedUserEmail}
                        close={handleCloseResetPopUp}
                      />
                    )}
                    {showAssignRolePopUp && (
                      <AssignRolesScreen
                        email={targetedUserEmail}
                        close={handleCLoseAssignRolePopUp}
                      />
                    )}
                    {showUserDetailPopUp && (
                      <ChangeUserDetails
                        user={selectedUser!}
                        close={() => setShowUserDetailPopUp(false)}
                      />
                    )}
                  </tr>
                ))
            ) : (
              <section>
                <p className="text-center text-md p-auto lg:text-xl">
                  No user found yet, Create one
                </p>
              </section>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default ViewUsersScreen;
