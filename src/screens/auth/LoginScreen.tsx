import { useFormik } from "formik";
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { showToast } from "../../middlewares/showToast";
import { login } from "../../store/apiService";
import { LoginType, StatusUpdatePropsType } from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import StatusUpdateLayout from "../components/StatusUpdateLayout";

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);
  const [statusUpdate, setStatusUpdate] =
    useState<StatusUpdatePropsType | null>(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values: LoginType) => {
      dispatch(login(values))
        .then((result: any) => {
          if (result.payload.status === 200) {
            navigate("/dashboard");
          } else {
            showToast(
              "warning",
              result?.payload?.response?.data?.message ||
                "Invalid Credentials ",
              2000
            );
          }
        })
        .catch((error: any) => {
          showToast("error", "Invalid username or password", 2000);
        });
    },
  });

  return (
    <div className="w-[90vw] duration-500 ease-in-out p-8 top-48 mx-4 lg:max-w-[33vw] absolute shadow-md transition-opacity animation-fadeIn md:top-8 md:right-8 items-center bg-slate-100 bg-opacity-80  hover:bg-opacity-90  justify-center rounded-lg">
      <h2 className="mb-4 text-2xl font-bold text-center text-green-900 lg:text-4xl ">
        LOG IN
      </h2>
      <p className="p-2 text-xs lg:text-lg">
        Kindly login if you are already a user.
      </p>
      {statusUpdate && (
        <StatusUpdateLayout
          statusUpdate={statusUpdate}
          setStatusUpdate={setStatusUpdate}
        />
      )}
      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="flex items-center mb-4">
          <div className="mr-2 text-gray-500">
            <FaUser />
          </div>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
            className="w-full p-2 border rounded outline-none focus:border-green-900"
          />
        </div>
        {formik.touched.username && formik.errors.username && (
          <div className="mb-2 text-red-500">{formik.errors.username}</div>
        )}
        <div className="flex items-center mb-4">
          <div className="mr-2 text-gray-500">
            <FaLock />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full p-2 border rounded outline-none focus:border-green-900 "
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="mb-2 text-red-300">{formik.errors.password}</div>
        )}
        <p className="m-2 text-xs text-center text-gray-600">
          Don't have an account?{" "}
          <span className="text-red-500">Ask the admin to sign you up</span>
        </p>

        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded cursor-pointer ${
            formik.isSubmitting || !formik.isValid
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-green-900"
          }`}
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {loading === "pending" ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
