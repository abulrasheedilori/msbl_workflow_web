import { useFormik } from "formik";
import { memo, useState } from "react";
import * as Yup from "yup";
import { showToast } from "../../middlewares/showToast";
import { assignRoles, getAllUsers } from "../../store/apiService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Status from "../components/Status";
import { UpdatePropType, initialUpdates } from "../request/CreateRequest";

const AssignRoleScreen: React.FC<{ email: string; close: () => void }> = ({
  email,
  close,
}) => {
  const [statusUpdate, setStatusUpdate] =
    useState<UpdatePropType>(initialUpdates);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const roles = ["initiator", "operations", "supervisor", "admin"];

  const formik = useFormik({
    initialValues: {
      roles: [],
    },
    validationSchema: Yup.object({
      roles: Yup.array()
        .min(1, "At least one role is required")
        .required("Required"),
    }),
    onSubmit: (values) => {
      const { roles } = values;
      const user = {
        email,
        roles,
      };
      dispatch(assignRoles(user))
        .then((result) => {
          if (result.payload.status === 200) {
            showToast(
              "success",
              result?.payload?.data?.message || `Role Re-assigned Successfully`,
              500
            );
            formik.resetForm();
          } else {
            showToast(
              "warning",
              result?.payload?.response?.data?.message ||
                `Role Re-assigned Failed`,
              500
            );
          }
        })
        .then(() => {
          dispatch(getAllUsers());
          setTimeout(() => close(), 2000);
        })
        .catch((err: any) => {
          showToast(
            "error",
            err?.response?.data?.message || `Error Re-assigning Role`,
            500
          );
        });
    },
  });

  return (
    <section className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-screen h-full duration-500 ease-in-out bg-green-50 lg:bg-transparent lg:hover:bg-green-50 transition-hover">
      <section className="relative p-4 bg-white border rounded-md shadow-md w-fit border-slate-200">
        <h2 className="font-bold text-center text-green-950 text-md lg:text-lg">
          Re-assign Roles
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
              htmlFor="roles"
              className="block text-sm font-medium text-gray-600 text-start"
            >
              {/* Role */}
            </label>
            <select
              id="roles"
              name="roles"
              multiple
              onChange={(e) => {
                formik.setFieldValue(
                  "roles",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                );
              }}
              onBlur={formik.handleBlur}
              value={formik.values.roles}
              className="p-2 border-2 rounded outline-none focus:ring focus:ring-green-900 w-36"
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role} value={role} className="text-green-900">
                  {role.toUpperCase()}
                </option>
              ))}
            </select>
            {formik.touched.roles && formik.errors.roles && (
              <div className="mt-1 text-red-500 whitespace-normal">
                {formik.errors.roles}
              </div>
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
                  : "bg-green-900 text-white"
              } py-2 px-4 rounded-md cursor-pointer`}
            >
              {loading === "pending" ? "Assigning Role..." : "Re-assign Role"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default memo(AssignRoleScreen);
