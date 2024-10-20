import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { showToast } from "../../middlewares/showToast";
import { getAllUsers, updateUser } from "../../store/apiService";
import { UserUpdate } from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Status from "../components/Status";
import { UpdatePropType, initialUpdates } from "../request/CreateRequest";

const ChangeUserDetails: React.FC<{ user: UserUpdate; close: () => void }> = ({
  user,
  close,
}) => {
  const [statusUpdate, setStatusUpdate] =
    useState<UpdatePropType>(initialUpdates);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      userId: user.userId,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      mobile: user.mobile,
    },
    validationSchema: Yup.object({
      userId: Yup.number(),
      username: Yup.string()
        .min(3, "A minimum of 3 characters is required")
        .required("Required"),
      firstname: Yup.string().required("Required"),
      lastname: Yup.string().required("Required"),
      mobile: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      const { userId, firstname, lastname, username, mobile } = values;
      const user: UserUpdate = {
        userId,
        username: username.trim(),
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        mobile: mobile.trim().toString(),
      };
      dispatch(updateUser(user))
        .then((response) => {
          if (response.payload.status === 200) {
            showToast(
              "success",
              response?.payload?.data?.message || `User Details Updated`,
              1000
            );
            formik.resetForm();
          } else {
            showToast(
              "warning",
              response?.payload?.response?.data?.message ||
                `User Details Update Failed`,
              1000
            );
          }
        })
        .then(() => {
          dispatch(getAllUsers());
          // setTimeout(() => close(), 1000);
        })
        .catch((err: any) => {
          showToast(
            "error",
            err?.response?.data?.message || `Error Updating User Details`,
            1000
          );
        });
    },
  });

  return (
    <section className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-screen h-full duration-500 ease-in-out bg-green-50 lg:bg-transparent lg:hover:bg-green-50 transition-hover">
      <section className="relative lg:w-[33vw] p-4 bg-white border rounded-md shadow-md w-fit border-slate-200">
        <h2 className="font-bold text-center text-green-950 text-md lg:text-lg">
          Update User Details
        </h2>
        <p className="p-4 pl-0 text-sm text-slate-500">
          You can update user details here.
        </p>
        <span
          className="absolute p-1 text-xs font-bold text-red-500 border border-red-600 cursor-pointer top-4 right-4 hover:bg-red-700 hover:text-white rounded-2xl"
          onClick={close}
        >
          close
        </span>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-full pb-8"
        >
          <div>
            <input
              type="text"
              id="userId"
              name="userId"
              hidden
              value={formik.values.userId}
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className="w-full p-2 text-black border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.username && formik.errors.username && (
              <div className="mt-1 text-xs text-red-500">
                {formik.errors.username}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-600"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstname}
              className="w-full p-2 text-black border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="mt-1 text-xs text-red-500">
                {formik.errors.firstname}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-600"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.lastname}
              className="w-full p-2 text-black border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className="mt-1 text-xs text-red-500">
                {formik.errors.lastname}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-600"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobile}
              className="w-full p-2 text-black border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="mt-1 text-xs text-red-500">
                {formik.errors.mobile}
              </div>
            )}
          </div>

          <Status
            {...statusUpdate}
            showStatus={showStatus}
            setShowStatus={setShowStatus}
          />
          <div className="text-center ">
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className={`${
                !formik.isValid || !formik.dirty
                  ? "bg-slate-400 text-gray-500"
                  : "bg-green-900 text-white"
              }   py-2 px-4 font-bold rounded cursor-pointer shadow-md mb-4`}
            >
              {loading === "pending" ? "Proceesing..." : "Update User"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default ChangeUserDetails;
