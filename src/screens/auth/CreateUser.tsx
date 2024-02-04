import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { signup } from "../../store/apiService";
import User from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Status from "../components/Status";
import { UpdatePropType, initialUpdates } from "../request/CreateRequest";

const CreateUser: React.FC = () => {
  const [statusUpdate, setStatusUpdate] =
    useState<UpdatePropType>(initialUpdates);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const roles = ["initiator", "operator", "supervisor", "admin"];

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
      firstname: Yup.string().required("Required"),
      lastname: Yup.string().required("Required"),
      mobile: Yup.string().required("Required"),
      role: Yup.string().required("Required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmpassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm Password is required"),
      // gender: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      const { firstname, lastname, role, email, username, mobile, password } =
        values;
      const user: User = {
        firstname,
        lastname,
        username,
        email,
        mobile: mobile.toString(),
        password,
        roles: [role.toLowerCase()],
      };
      console.log("Sign UP submitted:", user);
      dispatch(signup(user))
        .then((response) => {
          // console.log("SIGN IN RESPONSE : ", response);
          if (response.payload.status === 201) {
            setStatusUpdate({
              status: "succeeded",
              title: "Successful Sign Up",
              message: response.payload.data.message,
            });
            formik.resetForm();
          } else {
            setStatusUpdate({
              status: "failed",
              title: "Failed Sign Up",
              message: response.payload.response.data.message,
            });
          }
          setShowStatus(true);
        })
        .catch((err: any) => {
          console.log("ERROR IN SIGN UP: ", err);
          setStatusUpdate({
            status: "error",
            title: "Error Creating User",
            message: "An unexpected error occur while creating a new user",
          });
          setShowStatus(true);
        });
    },
  });

  return (
    <section className="w-full h-full overflow-y-auto lg:w-full">
      <header className="hidden p-8 text-xl font-bold text-green-900 lg:flex lg:text-4xl">
        New User
      </header>
      <div className=" w-full p-8 lg:w-[33vw]  mx-auto rounded-xl shadow-lg border-2 border-grey">
        {/* <div className="flex-1 border-2 border-green-700 "> */}
        <h2 className="text-2xl font-bold text-center">Create New User</h2>
        <p className="p-4 pl-0 text-justify">
          Kindly create a user and assign its role here
        </p>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-full pb-24"
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
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
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
                  : "bg-green-900 text-white "
              }   py-2 px-4 font-bold rounded cursor-pointer shadow-md mb-4`}
            >
              {loading === "pending" ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateUser;
