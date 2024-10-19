import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { showToast } from "../../middlewares/showToast";
import { signup } from "../../store/apiService";
import User from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Status from "../components/Status";
import { UpdatePropType, initialUpdates } from "../request/CreateRequest";

const CreateUser: React.FC = () => {
  const [statusUpdate, setStatusUpdate] =
    useState<UpdatePropType>(initialUpdates);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const roles = ["initiator", "operations", "supervisor", "admin"];

  const formik = useFormik({
    initialValues: {
      email: "",
      firstname: "",
      lastname: "",
      username: "",
      mobile: "",
      password: "",
      confirmpassword: "",
      role: "",
      gender: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string()
        .min(3, "A minimum of 3 characters is required")
        .required("Required"),
      firstname: Yup.string().required("required"),
      lastname: Yup.string().required("required"),
      mobile: Yup.string(),
      role: Yup.string().required("required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmpassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("please, confirm your password"),
    }),
    onSubmit: (values) => {
      const { firstname, lastname, role, email, username, mobile, password } =
        values;
      const user: User = {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        username: username.trim(),
        email: email.trim(),
        mobile: mobile.trim().toString(),
        password: password.trim(),
        roles: [role.toLowerCase()],
      };
      dispatch(signup(user))
        .then((response) => {
          if (response.payload.status === 201) {
            showToast(
              "success",
              response?.payload?.data?.message || `User Created Successfully`,
              1000
            );
            formik.resetForm();
          } else {
            showToast(
              "warning",
              response?.payload?.response?.data?.message ||
                `User Creation Failed`,
              1000
            );
          }
        })
        .catch((err: any) => {
          showToast(
            "error",
            err?.response?.data?.message || `Error Creating User`,
            1000
          );
        });
    },
  });

  return (
    <section className="w-full h-full overflow-y-auto">
      <header className="hidden py-4 text-xl font-bold text-black lg:pt-8 lg:px-8 lg:flex lg:text-2xl">
        New User
      </header>
      <p className="hidden mx-8 mb-8 text-xs text-slate-500 lg:flex lg:text-lg">
        Welcome! you can create a new user with a role here. Just fill in all
        the details, enable the user and the user is a go.
      </p>
      <div className=" w-full mb-8 p-8 lg:w-[33vw]  mx-auto rounded-xl shadow-lg border-2 border-grey">
        <h2 className="text-lg font-bold text-center">Create User</h2>
        <p className="p-4 pl-0 text-xs text-justify lg:text-sm text-slate-400">
          Kindly create a new user here and assign a role to it. You can later
          change role, password or delete as a supervisor.
        </p>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-full pb-8"
        >
          <div className="mb-4">
            <label
              htmlFor="firstName"
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
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
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
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
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
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
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
              // onBlur={formik.handleBlur}
              value={formik.values.mobile}
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="mt-1 text-xs text-red-500">
                {formik.errors.mobile}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.email && formik.errors.email && (
              <div className="mt-1 text-xs text-red-500">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.password && formik.errors.password && (
              <div className="mt-1 text-xs text-red-500">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmpassword"
              className="block text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmpassword}
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
            />
            {formik.touched.confirmpassword &&
              formik.errors.confirmpassword && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.confirmpassword}
                </div>
              )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              onChange={formik.handleChange}
              value={formik.values.role}
              className="w-full p-2 border rounded outline-none focus:border-green-900 "
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role} value={role} className="w-full p-2">
                  {role.toUpperCase()}
                </option>
              ))}
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="mt-1 text-red-500">{formik.errors.role}</div>
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
              {loading === "pending" ? "Proccessing..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateUser;
