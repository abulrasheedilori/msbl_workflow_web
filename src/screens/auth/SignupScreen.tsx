import { useFormik } from "formik";
import {
  FaLock,
  FaMailBulk,
  FaMobile,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import * as Yup from "yup";

const SignupScreen: React.FC = () => {
  const roles = ["Initiator", "Operations", "Supervisor", "Admin"];

  const formik = useFormik({
    initialValues: {
      email: "",
      firstname: "",
      lastname: "",
      mobile: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "Initiator",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("required"),
      firstname: Yup.string()
        .min(2, "First name must be at least two characters")
        .required("required"),
      lastname: Yup.string()
        .min(2, "Last name must be at least two characters")
        .required("Required"),
      mobile: Yup.string().required("required"),
      role: Yup.string().required("required"),
      username: Yup.string().required("required"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Atleast an uppercase letter, a lowercase letter, a digit, a special character, and 8 characters long or more."
        ),
      confirmPassword: Yup.string()
        .required("required")
        .nullable()
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      // Your signup logic here
      console.log("Sign Up submitted:", values);
    },
  });

  return (
    <div className="bg-green-200 w-[33vw] flex items-center justify-center absolute top-8 left-8 rounded-2xl shadow-md">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center text-green-900">
          Sign Up
        </h2>
        <p className="p-4 pl-0">Kindly sign up a user here</p>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="flex items-center mb-4">
            <div className="mr-2 text-gray-500">
              <FaMailBulk />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="p-2 border border-gray-300 rounded w-96"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="mb-2 text-red-500">{formik.errors.email}</div>
          )}

          <div className="flex items-center mb-4">
            <div className="mr-2 text-gray-500">
              <FaUser />
            </div>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="First Name"
              onChange={formik.handleChange}
              value={formik.values.firstname}
              className="p-2 border border-gray-300 rounded w-96"
            />
          </div>
          {formik.touched.firstname && formik.errors.firstname && (
            <div className="mb-2 text-red-500">{formik.errors.firstname}</div>
          )}

          <div className="flex items-center mb-4">
            <div className="mr-2 text-gray-500">
              <FaUser />
            </div>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Last Name"
              onChange={formik.handleChange}
              value={formik.values.lastname}
              className="p-2 border border-gray-300 rounded w-96"
            />
          </div>
          {formik.touched.lastname && formik.errors.lastname && (
            <div className="mb-2 text-red-500">{formik.errors.lastname}</div>
          )}

          <div className="flex items-center mb-4">
            <div className="mr-2 text-gray-500">
              <FaMobile />
            </div>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Mobile Number"
              onChange={formik.handleChange}
              value={formik.values.mobile}
              className="p-2 border border-gray-300 rounded w-96"
            />
          </div>
          {formik.touched.mobile && formik.errors.mobile && (
            <div className="mb-2 text-red-500">{formik.errors.mobile}</div>
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
              className="p-2 border border-gray-300 rounded w-96"
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="mb-2 text-red-500">{formik.errors.password}</div>
          )}
          <div className="flex items-center mb-4">
            <div className="mr-2 text-gray-500">
              <FaLock />
            </div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              className="p-2 border border-gray-300 rounded w-96"
            />
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="mb-2 text-red-500">
              {formik.errors.confirmPassword}
            </div>
          )}

          <div className="block mb-1 ml-6 text-sm font-medium text-gray-400">
            Role
          </div>

          <div className="flex items-center mb-4">
            <div className="mr-2 text-gray-500">
              <FaShoppingCart />
            </div>
            <select
              id="role"
              name="role"
              onChange={formik.handleChange}
              value={formik.values.role}
              className="p-2 border border-gray-300 rounded w-96"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          {formik.touched.role && formik.errors.role && (
            <div className="ml-6 text-sm text-red-500">
              {formik.errors.role}
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-2 mx-8 text-white bg-green-900 rounded cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;
