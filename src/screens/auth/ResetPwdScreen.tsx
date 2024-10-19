import { useFormik } from "formik";
import { memo, useState } from "react";
import * as Yup from "yup";
import { showToast } from "../../middlewares/showToast";
import { getAllUsers, resetPassword } from "../../store/apiService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Status from "../components/Status";
import { UpdatePropType, initialUpdates } from "../request/CreateRequest";

const ResetPwdScreen: React.FC<{
  email: string;
  close: () => void;
}> = ({ email, close }) => {
  const [statusUpdate, setStatusUpdate] =
    useState<UpdatePropType>(initialUpdates);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("confirmPassword"), ""], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      const { newPassword } = values;
      const user = { email, newPassword };
      console.log("USER REQ: ", user);
      dispatch(resetPassword(user))
        .then((response) => {
          if (response.payload.status === 200) {
            showToast(
              "success",
              response?.payload?.data?.message || `Password Reset Successfully`,
              1000
            );
            formik.resetForm();
          } else {
            showToast(
              "warning",
              response?.payload?.response?.data?.message ||
                `Resetting Password Failed`,
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
            err?.response?.data?.message || `Error Reseting Password`,
            1000
          );
        });
    },
  });

  return (
    <section className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-screen h-full duration-500 ease-in-out bg-transparent hover:bg-slate-50 transition-hover">
      <section className="relative p-4 bg-white border rounded-md shadow-md w-fit border-slate-200">
        <h2 className="font-bold text-center text-green-950 text-md lg:text-lg">
          Change Password
        </h2>
        <p className="p-4 pl-0 text-sm text-slate-500">
          Kindly re-assign a user with a role here
        </p>
        <span
          className="absolute p-1 text-xs font-bold text-red-500 border border-red-600 cursor-pointer top-4 right-4 hover:bg-red-700 hover:text-white rounded-2xl"
          onClick={close}
        >
          close
        </span>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mx-auto text-sm font-medium text-gray-600 text-start"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className="w-full p-2 text-black border rounded outline-none bg-slate-200 focus:border-green-700"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="mt-1 text-xs text-red-500 whitespace-normal w-fit">
                {formik.errors.newPassword}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmpassword"
              className="block mx-auto text-sm font-medium text-gray-600 text-start"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className="w-full p-2 text-black border rounded outline-none bg-slate-200 focus:border-green-700"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="mt-1 text-red-500 whitespace-normal">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <Status
            {...statusUpdate}
            showStatus={showStatus}
            setShowStatus={setShowStatus}
          />
          <div className="text-center">
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className={`${
                !formik.isValid || !formik.dirty
                  ? "bg-slate-400 text-gray-500"
                  : "bg-green-900 text-white "
              }   py-2 px-4 font-bold rounded-md shadow-lg cursor-pointer`}
            >
              {loading === "pending"
                ? "Reseting Password..."
                : "Reset Password"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default memo(ResetPwdScreen);
