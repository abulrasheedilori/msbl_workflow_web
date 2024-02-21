import { useFormik } from "formik";
import { memo, useState } from "react";
import * as Yup from "yup";
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
          // console.log("SIGN IN RESPONSE : ", response);
          if (response.payload.status === 200) {
            setStatusUpdate({
              status: "succeeded",
              title: "Successful",
              message: response.payload.data.message,
            });
            setShowStatus(true);
            formik.resetForm();
          } else {
            setStatusUpdate({
              status: "failed",
              title: "Failed",
              message: response.payload.response.data.message,
            });
          }
        })
        .then(() => {
          dispatch(getAllUsers());
          setTimeout(() => close(), 1000);
        })
        .catch((err: any) => {
          // console.log("ERROR IN SIGN UP: ", err);
          setStatusUpdate({
            status: "error",
            title: "Failed",
            message: error!,
          });
        });
    },
  });

  return (
    <section
      className={`w-[96vw] lg:w-[28vw] fixed bg-slate-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md shadow-md`}
    >
      <p className="text-2xl text-red-500 text-end" onClick={close}>
        X
      </p>
      <h2 className="text-2xl font-bold text-center text-green-900">
        Reset Password
      </h2>
      <p className="p-4 pl-0 text-sm text-green-900 lg:text-md">
        Kindly reset the user password here
      </p>
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
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
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
            {loading === "pending" ? "Reseting Password..." : "Reset Password"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default memo(ResetPwdScreen);
