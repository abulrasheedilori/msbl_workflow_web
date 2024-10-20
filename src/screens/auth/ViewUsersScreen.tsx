import { useEffect, useState } from "react";
import { showToast } from "../../middlewares/showToast";
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
    dispatch(enableOrDisableUser(request))
      .then((response) => {
        // console.log("IS_DISABLED : ", !isDisabled);
        dispatch(getAllUsers());
        showToast(
          !isDisabled ? "success" : "warning",
          !isDisabled ? "User is enabled" : "User is disabled",
          1000
        );
      })
      .catch((err) => {
        showToast("error", err?.response?.data?.message || err.message, 1000);
      });
  };

  const handleShowUserDetailPopUp = (id: number, user: User) => {
    const { username, firstname, lastname, mobile } = user && user;
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
    setTargetedUserEmail(email);
    setShowResetPopUp(true);
  };
  const handleCloseResetPopUp = () => {
    setShowResetPopUp(false);
  };
  const handleShowAssignRolePopUp = (email: string) => {
    setTargetedUserEmail(email);
    setShowAssignRolePopUp(true);
  };
  const handleCLoseAssignRolePopUp = () => {
    setShowAssignRolePopUp(false);
  };

  return (
    <section className="w-full h-full lg:h-[90vh] p-4  lg:px-8">
      <header className="text-xl font-bold lg:pt-4 lg:text-2xl">Users</header>
      <p className="mt-4 mb-8 text-xs lg:text-lg text-slate-500">
        You can manage all users, change password, re-assign roles and
        disable/enable users here.
      </p>
      <section className=" h-[70vh] overflow-auto hide-scrolbar">
        <table className="mx-4 text-sm bg-white border border-gray-300">
          <thead className="sticky top-0 ">
            <tr className="border border-gray-300 bg-slate-50 text-wrap">
              <th className="px-2 py-1 text-start">ID</th>
              <th className="px-2 py-1 text-start">USERNAME</th>
              <th className="px-2 py-1 text-start">FULL NAME</th>
              <th className="px-2 py-1 text-start">EMAIL</th>
              {user?.roles.includes("ROLE_ADMIN") && (
                <th className="px-2 py-1 text-start">PASSWORD</th>
              )}
              {user?.roles.includes("ROLE_SUPERVISOR") ? (
                <th className="px-2 py-1 text-start">RE-ASSIGN ROLE</th>
              ) : (
                <th className="px-2 py-1 text-start">ROLE</th>
              )}
              {/* {user?.roles.includes("ROLE_ADMIN") && (
                <th className="flex-1 px-2 py-1 text-start">ACTION</th>
              )}
              {user?.roles.includes("ROLE_ADMIN") && (
                <th className="px-2 py-1 text-start">UPDATE</th>
              )} */}
            </tr>
          </thead>
          <tbody>
            {listOfUser?.length > 0 ? (
              listOfUser
                .filter((user) => !user.roles.includes("ROLE_ADMIN"))
                .map((user_, index) => (
                  <tr
                    key={user_?.id?.toString()}
                    className="border-b bg-slate-50 text-start whitespace-nowrap text-nowrap hover:bg-green-900 hover:text-green-50"
                  >
                    <td className="px-2 py-1">{index + 1}</td>
                    <td className="px-2 py-1 ">{user_?.username}</td>
                    <td className="px-2 py-1 ">
                      {user_?.firstname + " " + user_.lastname}
                    </td>
                    <td className="px-2 py-1 ">{user_?.email}</td>
                    {user?.roles?.includes("ROLE_ADMIN") && (
                      <td
                        className="flex-1 px-2 py-1 "
                        onClick={() => handleShowResetPopUp(user_?.email)}
                      >
                        <span className="flex-1 px-2 py-1 text-sm italic font-semibold text-center text-yellow-700 underline cursor-pointer hover:underline hover:text-md">
                          {`reset ${user_.firstname}`}
                        </span>
                      </td>
                    )}
                    <td
                      className="flex-1 px-2 py-1 "
                      onClick={
                        user?.roles?.includes("ROLE_SUPERVISOR")
                          ? () => handleShowAssignRolePopUp(user_?.email)
                          : () => null
                      }
                    >
                      {user_.roles.map((role) => (
                        <div
                          key={role?.toString()}
                          className="flex-1 px-2 py-1 "
                        >
                          {user?.roles?.includes("ROLE_SUPERVISOR") ? (
                            <p className="text-xs text-center text-red-500 cursor-pointer hover:underline">
                              {role.slice(5).toLocaleLowerCase()}
                            </p>
                          ) : (
                            <p className="text-sm hover:text-sm">
                              {role?.slice(5)}
                            </p>
                          )}
                        </div>
                      ))}
                    </td>
                    {user?.roles?.includes("ROLE_ADMIN") && (
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
                          className={`text-xs underline italic font-bold ${
                            user_.isDisabled ? "text-red-500" : "text-green-500"
                          } cursor-pointer hover:underline`}
                        >
                          {!user_?.isDisabled
                            ? `enable ${user_.firstname}`
                            : `disable ${user_.firstname}`}
                        </p>
                      </td>
                    )}
                    {user?.roles?.includes("ROLE_ADMIN") && (
                      <td
                        className="flex-1 px-2 py-1 "
                        onClick={() =>
                          handleShowUserDetailPopUp(user_.id!, user_)
                        }
                      >
                        <span className="flex-1 px-2 py-1 text-xs italic font-semibold text-center text-yellow-700 underline cursor-pointer hover:underline hover:text-md">
                          {`update ${user_.firstname}`}
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
              <tr>
                <td
                  colSpan={6}
                  className="text-xs text-center text-red-600 p-auto lg:text-sm"
                >
                  No user found yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default ViewUsersScreen;
