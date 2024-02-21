import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
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
const options: UpdateStatusPromptPropType[] = [
  { id: "1", value: "started" },
  { id: "2", value: "pending" },
  { id: "3", value: "at registrars" },
  { id: "4", value: "being processed" },
  { id: "5", value: "awaiting confirmation" },
  { id: "6", value: "completed" },
];

type ReqType = { id: string; value: string };

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
  const [isAuthorize, setIsAuthorize] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { loading, user, error } = useAppSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (id: string) => {
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
                    id: "Updated At",
                    value: formatDate(request.updatedAt) ?? "NA",
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
                  { id: "Status", value: request.status ?? "STARTED" },
                  {
                    id: "Is Approved",
                    value: request.isApproved ? "APPROVED" : "NOT APPROVED",
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
                ]);
                setStatusUpdate({
                  status: "succeeded",
                  title: "Successful",
                  message: response.payload.data.message,
                });
              } else {
                setStatusUpdate({
                  status: "failed",
                  title: "Failed retrieving Request",
                  message: response.payload.response.data.message,
                });
                setShowStatus(true);
              }
            })
            .catch((error: any) => {
              setStatusUpdate({
                status: "error",
                title: "Failed",
                message: error.response.data.message,
              });
              setShowStatus(true);
            });
        } else {
          setStatusUpdate({
            status: "error",
            title: "Error",
            message: "Request is not available",
          });
          setShowStatus(true);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData?.(id!);
  }, [dispatch]);

  const goBack = () => {
    navigate("/dashboard");
  };

  const handleAuthorizeRequest = (requestId: number, isApproved: boolean) => {
    const request = { requestId, isApproved };
    dispatch(approveRequest(request))
      .then(async (response) => {
        if (response.payload.status === 200) {
          // user?.roles.includes("ROLE_OPERATOR") &&
          dispatch(getRequestById(requestId))
            .then((response) => {
              setSelectedReq(response.payload.data.data);
            })
            .catch((err) => {
              console.log("RELOAD_STATUS: ", err);
            });
          setStatusUpdate({
            status: "succeeded",
            title: "Successful",
            message: response.payload.data.message,
          });
          setShowStatus(true);
        } else {
          setStatusUpdate({
            status: "failed",
            title: "Failed",
            message: response.payload.response.data.message,
          });
        }
      })
      .catch((err: any) => {
        // console.log("ERROR IN ASSIGN_ROLES: ", err);
        setStatusUpdate({
          status: "error",
          title: "Failed",
          message: error!,
        });
        setShowStatus(true);
      });
  };

  //Update Request
  const handleUpdateStatus = (e: string) => {
    setSelectedOption(e);
    const req: UpdateStatusRequestType = {
      requestId: paramId,
      status: e,
    };
    dispatch(updateStatus(req)).then((response) => {
      response.payload.status === 200 &&
        user?.roles.includes("ROLE_OPERATOR") &&
        dispatch(getRequestById(paramId))
          .then((response) => {
            setSelectedReq(response.payload.data.data);
          })
          .catch((err) => {
            // console.log("RELOAD_STATUS: ", err);
          });
    });
  };
  //delete Request
  const handleDeleteRequest = (requestId: number) => {
    paramId &&
      dispatch(deleteRequest(requestId))
        .then((response) => {
          response.payload.status === 200 && navigate("/dashboard");
        })
        .catch(console.error);
  };

  const formik = useFormik<PostCommentType>({
    initialValues: {
      message: "",
      requestId: 0,
    },
    validationSchema: Yup.object({
      message: Yup.string()
        .min(2, "Length of character must be more than 2 words")
        .required("Required"),
    }),
    onSubmit: (values) => {
      if (paramId && values) {
        const commentReq: PostCommentType = {
          ...values,
          requestId: paramId,
        };
        dispatch(postComment(commentReq)).then((comment) => {
          formik.resetForm();
          dispatch(getRequestById(paramId))
            .then((response) => {
              setSelectedReq(response.payload.data.data);
            })
            .catch((err) => {
              // formik.setFieldError("message", err.message);
            });
        });
      }
    },
  });

  return (
    <section className="w-full lg:h-[90vh] flex-1 bg-green-50 mx-auto p-2 pt-8 overflow-y-auto">
      <header className="mx-8 text-xl font-bold text-center lg:text-4xl">
        Request Details
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
        <section className="mt-16">
          {request ? (
            request?.map((item) => (
              <div
                key={item.id.toString()}
                className="flex flex-col w-full my-4 lg:flex-row item-center"
              >
                <label
                  htmlFor={item.id}
                  className="px-2 font-bold text-gray-400 text-md"
                >
                  {item.id}:
                </label>
                <span
                  id="clientName"
                  className="px-2 text-green-900 lg:text-md text-bold"
                >
                  {!item?.id.toLowerCase().includes("url") ? (
                    item?.value
                  ) : (
                    <a
                      className="font-semibold text-red-600 underline whitespace-normal text-md"
                      href={item.value}
                      target="_blank"
                    >
                      {item.value}
                    </a>
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="text-4xl text-center">Loading ...</p>
          )}
          <Status
            {...statusUpdate}
            showStatus={showStatus}
            setShowStatus={setShowStatus}
          />
          <section className="flex flex-col items-center justify-start gap-4 m-4 lg:flex-row">
            {user?.roles.includes("ROLE_INITIATOR") ||
              (user?.roles.includes("ROLE_OPERATOR") && (
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
              ))}
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
          {user?.roles.includes("ROLE_OPERATOR") &&
            !selectedReq?.isApproved && (
              <section className="flex flex-row justify-start gap-4 m-4 item-center">
                <span
                  onClick={() => handleAuthorizeRequest(paramId, true)}
                  className="w-24 p-2 text-center text-white bg-green-500 rounded-md cursor-pointer hover:bg-green-700"
                >
                  Approve
                </span>
              </section>
            )}
        </section>

        <section className="w-full lg:w-[40vw] p-4 mx-auto flex flex-col items-center justify-center gap-2">
          <section className="w-full p-4 bg-gray-50 bg-opacity-10">
            <p className="mt-8 mb-4 text-xl font-bold text-center text-green-900">
              {selectedReq?.title ?? "Loading ..."}
            </p>
            <p className=" text-md text-left border-green-200 lg:w-[30vw] ">
              {selectedReq?.message ?? "Loading..."}
            </p>
            {selectedReq && (
              <p className="font-serif text-xs text-right text-slate-500 ">
                {formatDate(selectedReq.createdAt)}
              </p>
            )}
          </section>
          {/* ------display comments ------------- */}
          <section className="p-4 my-4 border border-green-100">
            <p className="py-2 text-xs text-gray-500">Comments</p>
            {selectedReq && selectedReq.comments.length > 0 ? (
              selectedReq?.comments.map((comment: CommentResponseType) => (
                <section className="p-4 mb-8 bg-gray-200 divide-gray-400 rounded-lg divide-2">
                  <p>{comment.message}</p>
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
              <p className="my-8 text-lg text-center text-red-500">
                No Comments yet!
              </p>
            )}

            {/* ------- Add comments ----------- */}
            {/* {user?.roles.includes("ROLE_INITIATOR") || */}
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
                  {/* {loading === "pending" ? (
                    <p className="text-center text-white">Posting...</p>
                  ) : ( */}
                  Post
                  {/* )} */}
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
