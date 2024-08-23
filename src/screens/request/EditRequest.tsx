import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { showToast } from "../../middlewares/showToast";
import { getAllRequestType, updateRequest } from "../../store/apiService";
import { RequestReqType, RequestTypeType } from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Status from "../components/Status";

export type UpdatePropType = { status: string; title: string; message: string };
export const initialUpdates: UpdatePropType = {
  status: "",
  title: "",
  message: "",
};

const EditRequest: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<RequestTypeType>();
  const [statusUpdate, setStatusUpdate] =
    useState<UpdatePropType>(initialUpdates);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { requestTypes, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page in history
  };

  //Route props
  const location = useLocation();
  const {
    requestId,
    title,
    message,
    clientName,
    clientMobile,
    clientEmail,
    documentUrl,
    debitAuthorizationUrl,
    narration,
    requestTypeId,
  } = (location.state.request as RequestReqType) || {};

  useEffect(() => {
    dispatch(getAllRequestType());
  }, [dispatch]);

  const handleRequestType = (e: string) => {
    setSelectedOption(
      requestTypes.find((item: RequestTypeType) => item.id === parseInt(e))
    );
  };

  const formik = useFormik({
    initialValues: {
      requestId: requestId || undefined,
      title: title || "",
      message: message || "",
      clientName: clientName || "",
      clientEmail: clientEmail || "",
      clientMobile: clientMobile || "",
      documentUrl: documentUrl || "",
      debitAuthorizationUrl: debitAuthorizationUrl || "",
      narration: narration || "",
      requestTypeId: requestTypeId || "",
    } as RequestReqType,
    validationSchema: Yup.object({
      // title: Yup.string()
      //   .min(2, "Length must be more than 2 characters")
      //   .required("Required"),
      message: Yup.string()
        .min(2, "Length must be more than 2 characters")
        .required("Required"),
      clientName: Yup.string()
        .min(2, "Client Name must be more than 2 characters")
        .required("Required"),
      clientEmail: Yup.string()
        .min(2, "Client Email must be more than 2 characters")
        .required("Required"),
      // clientMobile: Yup.string()
      //   .min(12, "Client Mobile must be more than 12 characters")
      //   .required("Required"),
      documentUrl: Yup.string()
        .min(16, "Document Url must be more than 16 characters")
        .required("Required"),
      debitAuthorizationUrl: Yup.string()
        .min(16, "Debit Authorization Url must be more than 16 characters")
        .required("Required"),
      narration: Yup.string()
        .min(2, "Narration must be more than 2 characters")
        .required("Required"),
      requestTypeId: Yup.number().required("Required"),
    }),
    onSubmit: (values) => {
      values.requestTypeId = selectedOption?.id || 1;
      dispatch(updateRequest({ ...values }))
        .then((response) => {
          if (response.payload.status === 200) {
            showToast(
              "success",
              response?.payload?.data?.message ||
                `Request Successfully Updated`,
              1000
            );
            // formik.resetForm();
            handleGoBack();
          } else {
            showToast(
              "warning",
              response?.payload?.response?.data?.message ||
                ` Updating Request Failed`,
              1000
            );
          }
          setShowStatus(true);
        })
        .catch((error: any) => {
          showToast(
            "error",
            error?.response?.data?.message || ` Error Updating Request`,
            1000
          );
        });
    },
  });

  return (
    <section className="w-full overflow-y-auto bg-slate-50">
      <header className="m-8 text-xl font-bold text-left lg:text-4xl">
        Update Request
      </header>
      <p className="mx-8 my-4 text-xs lg:text-lg">
        Edit all the details to update the present request
      </p>
      <div className="w-full lg:w-[45vw] h-auto lg:mx-auto my-8 rounded-2xl lg:shadow-md border-2 border-slate-200">
        <div className="p-8 ">
          <h2 className="hidden text-lg font-bold text-center text-black lg:flex lg:text-2xl">
            Edit Request Form
          </h2>
          <p className="p-4 pl-0 text-sm lg:text-md">
            Kindly update this request here.
          </p>
          <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1">
            {/* <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600"
              >
                Title Of Request
              </label>
              <input
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className="w-full p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.title}
                </div>
              )}
            </div> */}
            <div className="my-4 ">
              <select
                name="requestTypeId"
                id="requestTypeId"
                className="w-full h-[40px] bg-green-700 px-4 rounded-md text-white border-2 outline-none focus:border-green-900"
                value={selectedOption?.id}
                onChange={(e) => handleRequestType(e.target.value)}
              >
                <option value="" disabled>
                  Select Request-Type
                </option>
                {requestTypes &&
                  requestTypes.map((reqType: RequestTypeType) => (
                    <option key={reqType.id} value={reqType.id}>
                      {reqType.title.toUpperCase()}
                    </option>
                  ))}
              </select>
              {selectedOption && (
                <p className="text-xs">Note: {selectedOption?.description}</p>
              )}
              {formik.touched.requestTypeId && formik.errors.requestTypeId && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.requestTypeId}
                </div>
              )}
            </div>
            <div className="mb-1">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-600"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                maxLength={5000}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className="w-full h-[100px] p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {formik.touched.message && formik.errors.message && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.message}
                </div>
              )}
            </div>
            <div className="mb-1">
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-600"
              >
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clientName}
                className="w-full p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {formik.touched.clientName && formik.errors.clientName && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.clientName}
                </div>
              )}
            </div>

            <div className="mb-1">
              <label
                htmlFor="clientEmail"
                className="block text-sm font-medium text-gray-600"
              >
                Client Email
              </label>
              <input
                type="text"
                id="clientEmail"
                name="clientEmail"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clientEmail}
                className="w-full p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {formik.touched.clientEmail && formik.errors.clientEmail && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.clientEmail}
                </div>
              )}
            </div>

            <div className="mb-1">
              <label
                htmlFor="clientMobile"
                className="block text-sm font-medium text-gray-600"
              >
                Client Mobile Number
              </label>
              <input
                type="number"
                id="clientMobile"
                name="clientMobile"
                // onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.clientMobile}
                className="w-full p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {/* {formik.touched.clientMobile && formik.errors.clientMobile && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.clientMobile}
                </div>
              )} */}
            </div>

            <div className="mb-1">
              <label
                htmlFor="clientMobile"
                className="block text-sm font-medium text-gray-600"
              >
                Document Url
              </label>
              <input
                type="url"
                id="documentUrl"
                name="documentUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.documentUrl}
                className="w-full p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {formik.touched.documentUrl && formik.errors.documentUrl && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.documentUrl}
                </div>
              )}
            </div>

            <div className="mb-1">
              <label
                htmlFor="clientMobile"
                className="block text-sm font-medium text-gray-600"
              >
                Debit Authorization Url
              </label>
              <input
                type="url"
                id="debitAuthorizationUrl"
                name="debitAuthorizationUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.debitAuthorizationUrl}
                className="w-full p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {formik.touched.debitAuthorizationUrl &&
                formik.errors.debitAuthorizationUrl && (
                  <div className="mt-1 text-xs text-red-500">
                    {formik.errors.debitAuthorizationUrl}
                  </div>
                )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="clientMobile"
                className="block text-sm font-medium text-gray-600"
              >
                Narration
              </label>
              <input
                type="text"
                id="narration"
                name="narration"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.narration}
                className="w-full p-2 border-2 rounded outline-none focus:border-green-900"
              />
              {formik.touched.narration && formik.errors.narration && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.narration}
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
                className={`px-4 py-2 text-white ${
                  !formik.isValid || !formik.dirty
                    ? "bg-slate-400 text-gray-500"
                    : "bg-green-900"
                } rounded cursor-pointer`}
              >
                {loading === "pending"
                  ? "Updating Request..."
                  : "Update Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditRequest;
