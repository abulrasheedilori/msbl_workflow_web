import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { FaArrowLeft, FaRegEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { showToast } from "../../middlewares/showToast";
import {
  approveRequest,
  deleteRequest,
  getRequestById,
  postComment,
  updateStatus,
} from "../../store/apiService";
import {
  CommentResponseType,
  PostCommentType,
  RequestResponseType,
  UpdateStatusRequestType,
} from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import formatDate from "../../utils/formatDate";
import Status from "../components/Status";
import { UpdatePropType, initialUpdates } from "./CreateRequest";

type UpdateStatusPromptPropType = { id: string; value: string };
type ReqType = { id: string; value: string };

const iniOptions: UpdateStatusPromptPropType[] = [
  { id: "5", value: "awaiting confirmation" },
  { id: "6", value: "completed" },
];

const options: UpdateStatusPromptPropType[] = [
  { id: "1", value: "started" },
  { id: "2", value: "pending" },
  { id: "4", value: "being processed" },
  { id: "3", value: "at registrars" },
];

const ViewRequestFull = () => {
  const [paramId, setParamId] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedReq, setSelectedReq] = useState<RequestResponseType | null>(
    null
  );
  const [request, setRequest] = useState<ReqType[]>([]);
  const [statusUpdate, setStatusUpdate] =
    useState<UpdatePropType>(initialUpdates);
  const [showStatus, setShowStatus] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { loading, user, error } = useAppSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const showApprovalStatus = (status: boolean) => {
    switch (status) {
      case true:
        return "APPROVED";
      case false:
        return "DECLINED";
      default:
        return "AWAITING_APPROVAL";
    }
  };

  const fetchData = useCallback(
    async (id: string) => {
      try {
        if (typeof id !== "undefined") {
          const parsedId = parseInt(id);
          setParamId(parsedId);
          await dispatch(getRequestById(parsedId))
            .then((response) => {
              // console.log("REQUEST RESPONSE BY ID: ", response);
              if (response.payload.status === 200) {
                const request = response.payload.data.data;
                setSelectedReq(request);
                setRequest([
                  {
                    id: "Created At",
                    value: formatDate(request.createdAt) ?? "NA",
                  },
                  {
                    id: "Client Email",
                    value: request.clientEmail ?? "NA",
                  },

                  {
                    id: "Client Mobile",
                    value: request.clientMobile ?? "NA",
                  },
                  {
                    id: "Client Name",
                    value: request.clientName ?? "NA",
                  },
                  {
                    id: "Narration",
                    value: request.narration ?? "NA",
                  },
                  {
                    id: "Status",
                    value: request.status ?? "NA",
                  },
                  {
                    id: "Approval Status",
                    value: showApprovalStatus(request.isApproved),
                  },
                  {
                    id: "Debit Authorization URL",
                    value: request.debitAuthorizationUrl ?? "NA",
                  },
                  {
                    id: "Document URL",
                    value: request.documentUrl ?? "NA",
                  },
                  {
                    id: "Request Type",
                    value: request.requestType.title ?? "NA",
                  },
                  {
                    id: "Initiator",
                    value:
                      `${request.user.firstname} ${request.user.lastname}` ??
                      "NA",
                  },
                  {
                    id: "Initiator`s Mobile",
                    value: `${request.user.mobile}` ?? "NA",
                  },
                  {
                    id: "Initiator`s Email",
                    value: `${request.user.email}` ?? "NA",
                  },
                ]);
              } else {
                showToast(
                  "warning",
                  response?.payload?.response?.data?.message ||
                    "Failed retrieving Request",
                  1000
                );
              }
            })
            .catch((error: any) => {
              showToast(
                "error",
                error?.response?.data?.message || "An error occured ",
                1000
              );
            });
        } else {
          showToast("warning", "Request is not available", 1000);
        }
      } catch (error: any) {
        showToast(
          "error",
          error?.response?.data?.message || "An error occured ",
          1000
        );
        console.error("Error fetching data:", error);
      }
    },
    [showStatus]
  );

  useEffect(() => {
    id && fetchData(id);
  }, [id, fetchData]);

  const goBack = () => {
    navigate("/dashboard");
  };

  const handleNavToEditReq = () =>
    navigate("edit-request", {
      state: { request: { ...selectedReq, requestId: id && parseInt(id) } },
    });

  //Handle Authorize
  const handleAuthorizeRequest = useCallback(
    (requestId: number, isApproved: boolean) => {
      const request = { requestId, isApproved };
      dispatch(approveRequest(request))
        .then((response) => {
          if (response.payload.status === 200) {
            dispatch(getRequestById(paramId)).then((reponse) =>
              setSelectedReq(reponse.payload.data.data)
            );
            showToast(
              "success",
              response?.payload?.data?.message || "Authorized",
              1000
            );
          } else {
            showToast(
              "error",
              response?.payload?.response?.data?.message || "Error Authorizing",
              2000
            );
          }
        })
        .catch((err: any) => {
          showToast("error", error || "An error Occured ", 2000);
        });
    },
    [selectedReq]
  );

  //Update Request
  const handleUpdateStatus = (e: string) => {
    setSelectedOption(e);
    const req: UpdateStatusRequestType = {
      requestId: paramId,
      status: e,
    };
    dispatch(updateStatus(req)).then((response) => {
      response.payload.status === 200 &&
        dispatch(getRequestById(paramId))
          .then((response) => {
            setSelectedReq(response.payload.data.data);
            showToast(
              "success",
              response?.payload?.data?.message || `Successfully Updated`,
              1000
            );
          })
          .catch((err) => {
            showToast("error", "An error occured", 2000);
          });
    });
  };

  //delete Request
  const handleDeleteRequest = (requestId: number) => {
    paramId &&
      dispatch(deleteRequest(requestId))
        .then((response) => {
          if (response.payload.status === 200) {
            showToast(
              "success",
              response?.payload?.data?.message ||
                `Request Deleted Successfully`,
              1000
            );
            navigate("/dashboard");
          } else {
            showToast(
              "warning",
              response?.payload?.response?.data?.message ||
                `Request Deletion Failed`,
              1000
            );
          }
        })

        .catch((err: any) => {
          showToast(
            "error",
            err?.response?.data?.message ||
              `Error Occured while deleting Request`,
            1000
          );
        });
  };

  const formik = useFormik<PostCommentType>({
    initialValues: {
      message: "",
      requestId: 0,
    },
    validationSchema: Yup.object({
      message: Yup.string()
        .min(2, "Length of character must be more than 2 words")
        .max(1500, "Length of character must not be more than 1500 words")
        .required("Required"),
    }),
    onSubmit: (values) => {
      if (paramId && values) {
        const commentReq: PostCommentType = {
          ...values,
          requestId: paramId,
        };
        dispatch(postComment(commentReq)).then((comment) => {
          showToast(
            "success",
            comment?.payload?.data?.message || `Comment Updated`,
            1000
          );
          formik.resetForm();

          dispatch(getRequestById(paramId))
            .then((response) => {
              setSelectedReq(response.payload.data.data);
            })
            .catch((err) => {
              showToast(
                "error",
                err?.response?.payload?.data?.message ||
                  `Error Posting Comment`,
                1000
              );
            });
        });
      }
    },
  });

  return (
    <section className="relative w-full lg:h-[90vh] flex-1 bg-green-50 mx-auto p-2 pt-4 overflow-y-auto">
      <header className="mx-8 text-xl font-bold text-center lg:text-2xl">
        REQUEST DETAILS
      </header>
      <section className="relative h-auto p-4 mx-auto my-8 rounded-md lg:p-16">
        <span className="text-sm lg:text.md absolute p-2 shadow-md top-2 right-2 bg-red-50 rounded-xl">
          {selectedReq?.status?.toUpperCase() ?? "Loading..."}
        </span>
        <button
          onClick={goBack}
          className="absolute p-2 ml-4 shadow-md cursor-pointer top-2 left-2 bg-blue-50 rounded-xl"
        >
          <FaArrowLeft size={24} />
        </button>

        <section className="mt-16 overflow-x-hidden">
          {request ? (
            request?.map((item) => (
              <div
                key={item.id.toString()}
                className="flex flex-col w-full gap-2 my-4 lg:flex-row item-center"
              >
                <label
                  htmlFor={item.id}
                  className="text-sm font-bold text-gray-400"
                >
                  {item.id}:
                </label>
                <section>
                  {item?.id.toLowerCase().includes("email") && (
                    <a
                      className="text-xs font-semibold text-red-400 underline whitespace-nowrap"
                      href={`mailto:${item.value}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item?.value}
                    </a>
                  )}

                  {item?.id.toLowerCase().includes("url") && (
                    <a
                      className="text-xs font-semibold text-red-400 underline whitespace-nowrap"
                      href={`${item.value}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item?.value}
                    </a>
                  )}

                  {!item?.id.toLowerCase().includes("email") &&
                    !item?.id.toLowerCase().includes("url") && (
                      <span className="font-bold text-black lg:text-md text-bold">
                        {item?.value}
                      </span>
                    )}
                </section>
              </div>
            ))
          ) : (
            <p className="text-4xl text-center">Loading request...</p>
          )}
          <Status
            {...statusUpdate}
            showStatus={showStatus}
            setShowStatus={setShowStatus}
          />
          <section className="flex flex-col items-center justify-start gap-4 m-4 lg:flex-row">
            {selectedReq?.isApproved &&
              user?.roles.includes("ROLE_INITIATOR") && (
                <select
                  className="w-[180px] h-[40px] rounded-md bg-slate-200 p-2 outline-none"
                  value={selectedOption}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                >
                  <option value="" disabled>
                    Update Status
                  </option>
                  {iniOptions.map((option: UpdateStatusPromptPropType) => (
                    <option key={option.id} value={option.value}>
                      {option.value.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}

            {/* {selectedReq?.isApproved && */}
            {user?.roles?.includes("ROLE_OPERATIONS") && (
              <select
                className="w-[180px] h-[40px] rounded-md bg-slate-200 p-2 outline-none"
                value={selectedOption}
                onChange={(e) => handleUpdateStatus(e.target.value)}
              >
                <option value="" disabled>
                  Update Status
                </option>
                {options.map((option: UpdateStatusPromptPropType) => (
                  <option key={option.id} value={option.value}>
                    {option.value.toUpperCase()}
                  </option>
                ))}
              </select>
            )}

            {user?.roles.includes("ROLE_SUPERVISOR") && (
              <section
                onClick={() => handleDeleteRequest(paramId)}
                className="flex flex-row justify-center w-[180px] gap-2 p-2 bg-slate-200  rounded-md item-center hover:bg-red-500 hover:text-gray-50"
              >
                <FaTrash size={18} color="red" className="text-red-50" />
                <span className="cursor-pointer text-md hover:text-sm">
                  Delete Request
                </span>
              </section>
            )}
            <p className="text-sm text-red-500">
              {loading === "failed" && "failed"}
            </p>
          </section>
          <Status
            {...statusUpdate}
            showStatus={showStatus}
            setShowStatus={setShowStatus}
          />
          {user?.roles.includes("ROLE_OPERATIONS") &&
            selectedReq?.isApproved === null && (
              <section className="flex flex-row justify-start gap-4 m-4 item-center">
                <span
                  onClick={() => handleAuthorizeRequest(paramId, true)}
                  className="w-24 p-2 text-center text-white bg-green-500 rounded-md cursor-pointer hover:bg-green-700"
                >
                  {"Approve"}
                </span>
                <span
                  onClick={() => handleAuthorizeRequest(paramId, false)}
                  className="w-24 p-2 text-center text-white bg-red-500 rounded-md cursor-pointer hover:bg-red-700"
                >
                  {"Decline"}
                </span>
              </section>
            )}
          {user?.roles.includes("ROLE_OPERATIONS") &&
            selectedReq?.isApproved && (
              <section className="flex flex-row justify-start gap-4 m-4 item-center">
                <span
                  onClick={() => handleAuthorizeRequest(paramId, false)}
                  className="w-24 p-2 text-center text-white bg-red-500 rounded-md cursor-pointer hover:bg-red-700"
                >
                  {"Decline"}
                </span>
              </section>
            )}

          {user?.roles.includes("ROLE_OPERATIONS") &&
            selectedReq?.isApproved === false && (
              <section className="flex flex-row justify-start gap-4 m-4 item-center">
                <span
                  onClick={() => handleAuthorizeRequest(paramId, true)}
                  className="w-24 p-2 text-center text-white bg-green-500 rounded-md cursor-pointer hover:bg-green-700"
                >
                  {"Approve"}
                </span>
              </section>
            )}
          {user?.roles.includes("ROLE_INITIATOR") &&
            selectedReq?.isApproved === false && (
              <button
                onClick={handleNavToEditReq}
                className="flex flex-row items-center justify-center gap-2 p-2 ml-4 border rounded-lg shadow-md border-slate-200 hover:bg-green-700 "
              >
                <FaRegEdit
                  size={24}
                  color="green"
                  className="cursor-pointer hover:bg-green-700"
                />
                <span className="font-bold text-md text-green-950 hover:text-slate-50">
                  Edit Details
                </span>
              </button>
            )}
        </section>

        <section className=" w-full lg:w-[40vw] p-4 mx-auto flex flex-col items-center justify-center gap-2 border">
          <section className="w-full p-4 bg-gray-50 bg-opacity-10">
            <p className="mt-8 mb-4 font-bold text-center text-black break-words whitespace-normal text-md lg:text-lg">
              {selectedReq?.title?.toUpperCase()}
            </p>
            <p className="whitespace-normal break-words text-md text-center border-green-200 lg:w-[30vw] ">
              {selectedReq?.message}
            </p>
            {selectedReq && (
              <p className="font-serif text-xs text-right text-slate-500 ">
                {formatDate(selectedReq.createdAt)}
              </p>
            )}
          </section>

          {/* ------display comments ------------- */}
          <section className=" w-full lg:w-[38vw] p-4 mx-auto flex flex-col items-center justify-center gap-2 border ">
            <p className="py-2 text-xs text-gray-500">Comments</p>
            {selectedReq && selectedReq.comments.length > 0 ? (
              selectedReq?.comments.map((comment: CommentResponseType) => (
                <section className="w-full p-4 mb-8 bg-gray-200 divide-gray-400 rounded-lg divide-2">
                  <p className="break-words whitespace-normal ">
                    {comment.message}
                  </p>
                  <div className="flex flex-col w-full lg:flex-row lg:justify-between">
                    {comment && (
                      <span className="pr-4 text-xs text-left text-slate-400 lg:text-sm lg:text-right">
                        by:
                        {`${comment.user.firstname} ${comment.user.lastname}
                        `}
                      </span>
                    )}
                    {comment && (
                      <span className="pr-4 text-xs text-gray-400 ">
                        {formatDate(comment?.createdAt) ?? "Loading..."}
                      </span>
                    )}
                  </div>
                </section>
              ))
            ) : (
              <p className="my-8 text-xs text-center text-red-500">
                No Comments yet!
              </p>
            )}

            {/* ------- Add comments ----------- */}
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col items-start justify-center gap-4 lg:flex-row"
            >
              <div className="">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Add comment here"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                  className="w-full lg:w-[25vw] p-2 border-2 outline-none focus:border-green-900 rounded"
                />
                {formik.touched.message && formik.errors.message && (
                  <div className="mt-1 text-red-500">
                    {formik.errors.message}
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={!formik.isValid}
                  className={`w-full lg:w-24 px-4 py-2 text-white bg-green-900 rounded cursor-pointer ${
                    formik.isValid ? "bg-green-900" : "bg-gray-400"
                  }`}
                >
                  {loading === "pending" ? (
                    <p className="text-center text-white">Posting...</p>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </section>
        </section>
      </section>
    </section>
  );
};

export default ViewRequestFull;
