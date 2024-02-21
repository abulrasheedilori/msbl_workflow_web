import { useFormik } from "formik";
import { memo, useState } from "react";
import * as Yup from "yup";
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
      console.log("Assign_Roles Req Obj submitted:", user);
      dispatch(assignRoles(user))
        .then((response) => {
          console.log("SIGN IN RESPONSE : ", response);
          if (response.payload.status === 200) {
            setStatusUpdate({
              status: "succeeded",
              title: "Successful",
              message: response.payload.data.message,
            });
            formik.resetForm();
            setShowStatus(true);
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
          console.log("ERROR IN ASSIGN_ROLES: ", err);
          setStatusUpdate({
            status: "error",
            title: "Failed",
            message: error!,
          });
          setShowStatus(true);
        });
    },
  });

  return (
    <section
      className={`w-[96vw] mx-auto lg:size-fit bg-slate-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md shadow-md`}
    >
      <p className="text-2xl text-red-500 text-end" onClick={close}>
        X
      </p>
      <h2 className="text-lg font-bold text-center text-green-900 lg:text-2xl">
        Re-assign Roles
      </h2>
      <p className="p-4 pl-0 text-sm text-green-900">
        Kindly re-assign a user with a role here
      </p>
      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="mb-4">
          <label
            htmlFor="role"
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
            className="p-2 border-2 rounded outline-none focus-green-900 w-36"
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
            }   py-2 px-4 rounded-md cursor-pointer`}
          >
            {loading === "pending" ? "Assigning Role..." : "Re-assign Role"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default memo(AssignRoleScreen);
