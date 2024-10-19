import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import * as XLSX from "xlsx";
import { showToast } from "../../middlewares/showToast";
import {
  filterRequest,
  getAllRequestsFromAllUsers,
} from "../../store/apiService";
import { FilteredReqType } from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const RequestsTable = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateValid, setIsDateValid] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { listOfRequest } = useAppSelector((state) => state.auth);
  const [requests, setRequests] = useState(listOfRequest);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    dispatch(getAllRequestsFromAllUsers())
      .then((response) => setRequests(response.payload.data.data))
      .catch((error) =>
        console.log(
          "AUDIT_REQ: ON MOUNT - dispatch getAllRequestsFromAllUsers: ",
          error
        )
      );
  }, [dispatch]);

  useEffect(() => {
    // Check if startDate and endDate are not empty strings
    const isValidStartDate = startDate !== "";
    const isValidEndDate = endDate !== "";

    // Check date validity conditions
    const isDateValid =
      isValidStartDate &&
      isValidEndDate &&
      new Date(startDate) <= new Date(endDate) &&
      new Date(endDate) <= new Date();

    // Set the state
    setIsDateValid(isDateValid);
  }, [startDate, endDate]);

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const flattenRequests = requests?.flatMap((request) => {
    const { comments, user } = request;
    const sortedComments = comments
      .slice()
      .sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
      )
      .map((comment) => comment?.message + `[${comment?.createdAt}]`)
      .join(", ");

    return [
      {
        ID: request?.id,
        TITLE: request?.title,
        "REQUEST STATUS": request?.status,
        "CLIENT NAME": request?.clientName,
        "CLIENT EMAIL": request?.clientEmail,
        "CLIENT MOBILE": request?.clientMobile,
        "APPROVAL STATUS": request?.isApproved ? "APPROVED" : "NOT_APPROVED",
        INITIATOR: user?.firstname + " " + user?.lastname,
        "INITIATOR MOBILE": user?.mobile,
        "REQUEST TYPE OR SLA": request?.reqType,
        "CREATION DATE": new Date(request?.createdAt).toLocaleString(),
        COMMENTS: sortedComments,
      },
    ];
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(flattenRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");
    XLSX.writeFile(
      workbook,
      "requests_audit_until_" + new Date().toUTCString() + ".xlsx"
    );
  };

  const filterRequestByDate = async () => {
    const filterReq: FilteredReqType = {
      startDate: startDate + "T00:00:00.000Z",
      endDate: endDate + "T23:59:59.999Z",
    };

    if (!isDateValid) {
      console.log(isDateValid);
      setStartDate("");
      setEndDate("");
      showToast("warning", "Ensure the start date is lesser than the end date");
      setShowFilter(false);
      return;
    }

    dispatch(filterRequest(filterReq))
      .then((response) => {
        const filteredRequests = response.payload?.data?.data?.filter(
          (request: any) => {
            const requestDate = new Date(request?.createdAt);
            return (
              requestDate >= new Date(startDate + "T00:00:00.000Z") &&
              requestDate <= new Date(endDate + "T23:59:59.999Z")
            );
          }
        );
        setRequests(filteredRequests);
        setStartDate("");
        setEndDate("");
        setShowFilter(false);
      })
      .catch((error: any) => setIsDateValid(false));
  };

  //Handle Select Start Date
  const handleStartDate = (e: any) => {
    setStartDate(e.target.value);
    e.target.blur();
  };
  //Handle select End Date
  const handleEndDate = (e: any) => {
    setEndDate(e.target.value);
    e.target.blur();
  };

  if (!requests) {
    return (
      <section className="box-content justify-center items-center w-full h-[80vh]">
        <span className="flex-1 text-2xl text-center lg:text-4xl">
          Wait! Loading all request...
        </span>
      </section>
    );
  }

  return (
    <section className=" box-content w-[90vw] lg:w-[85vw] h-[80vh] p-4 lg:p-8 lg:pt-4 scroll-smooth">
      {showFilter && (
        <section className="absolute top-0 bottom-0 left-0 right-0 z-50 w-screen h-full duration-500 ease-in-out rounded-md bg-opacity-60 transition-bg-opacity bg-green-950 hover:bg-opacity-80">
          <section className=" flex flex-col justify-center  w-[94vw] mx-auto lg:w-fit gap-1 p-4 mt-0  lg:mt-8 lg:items-center lg:flex-row">
            <section className="flex flex-col justify-start gap-2 lg:flex-row">
              <section className="flex flex-col items-center gap-2 lg:flex-row flex-center">
                <input
                  className="w-[70vw] lg:w-[12vw] p-2 h-[40px] focus:border-green-600 outline-none border-2 border-slate-200 rounded-lg shadow-sm"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDate(e)}
                  // onBlur={validateDates}
                />
                <input
                  className="w-[70vw]  p-2 lg:w-[12vw] lg:mx-0 h-[40px] border-2 focus:border-green-600 outline-none border-slate-200 rounded-lg shadow-sm"
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDate(e)}
                  // onBlur={validateDates}
                />
                <button
                  onClick={filterRequestByDate}
                  className="w-[70vw] lg:w-auto p-2 font-serif font-bold text-white bg-green-900 border border-green-800 rounded-lg hover:bg-green-600"
                >
                  Filter
                </button>
                <button
                  className="w-[70vw]  p-2 font-serif font-bold text-green-900 bg-yellow-400 border border-green-800 rounded-lg lg:w-auto hover:bg-green-600"
                  onClick={exportToExcel}
                >
                  Export to Excel
                </button>
                <button
                  className="w-[70vw]  p-2 font-serif font-bold text-white bg-red-400 border border-red-800 rounded-lg lg:w-auto hover:bg-red-600"
                  onClick={() => setShowFilter(false)}
                >
                  Close
                </button>
              </section>
            </section>
          </section>
        </section>
      )}
      <section className="">
        <section className="mb-4 lg:p-4">
          <section className="flex flex-row items-center justify-between">
            <header className="text-xl font-bold text-black text-start lg:text-2xl">
              Audit Requests
            </header>
            <FaFilter color="black" size={18} onClick={handleShowFilter} />
          </section>
          <p className="my-4 text-xs lg:text-lg text-slate-500">
            You can filter all requests here and export it as an excel sheet for
            auditing purpose.
          </p>
        </section>
      </section>

      <section className="box-content  w-[85vw]  h-[65vh] overflow-auto">
        <table className="mx-auto bg-white border border-gray-300">
          <thead className="sticky top-0 ">
            <tr className="border border-gray-300 bg-slate-50 text-nowrap">
              <th className="flex-1 px-2 py-1 border-b text-start">S/NO</th>
              <th className="flex-1 px-2 py-1 border-b text-start">ID</th>
              <th className="px-2 py-1 border-b text-start flex-3">TITLE</th>
              <th className="flex-1 px-2 py-1 border-b text-start">STATUS</th>
              <th className="flex-1 px-2 py-1 border-b text-start">NAME</th>
              <th className="flex-1 px-2 py-1 border-b text-start">EMAIL</th>
              <th className="flex-1 px-2 py-1 border-b text-start">MOBILE</th>
              <th className="flex-1 px-2 py-1 border-b text-start">APPROVAL</th>
              <th className="flex-1 px-2 py-1 border-b text-start">
                INITIATOR
              </th>
              <th className="flex-1 px-2 py-1 border-b text-start">
                INITIATOR MOBILE
              </th>
              <th className="px-2 py-1 border-b text-start flex-3">
                REQUEST TYPE
              </th>
              <th className="flex-1 px-2 py-1 border-b text-start">
                CREATED AT
              </th>
              <th className="flex-1 px-2 py-1 border-b text-start">
                LAST COMMENTS
              </th>
            </tr>
          </thead>

          <tbody>
            {requests?.map((request, index) => (
              <tr
                key={request?.id}
                className="text-center text-nowrap hover:bg-green-900 hover:text-green-50"
              >
                <td className="flex-1 border-b">{index + 1}</td>
                <td className="flex-1 border-b">{request?.id}</td>
                <td className="p-2 border-b flex-3">{request?.title}</td>
                <td className="flex-1 p-2 border-b">
                  {request?.status?.toLocaleUpperCase()}
                </td>
                <td className="flex-1 p-2 border-b">{request?.clientName}</td>
                <td className="flex-1 p-2 border-b">{request?.clientEmail}</td>
                <td className="flex-1 p-2 border-b">{request?.clientMobile}</td>
                <td className="flex-1 p-2 border-b">
                  {request?.isApproved ? "APPROVED" : "NOT_APPROVED"}
                </td>
                <td className="flex-1 p-2 border-b">
                  {request?.user?.firstname + " " + request?.user?.lastname}
                </td>
                <td className="flex-1 p-2 border-b">{request?.user?.mobile}</td>
                <td className="p-2 border-b flex-3">{request?.reqType}</td>
                <td className="flex-1 p-2 border-b">
                  {new Date(request?.createdAt).toUTCString()}
                </td>
                <td className="flex-1 p-2 border-b">
                  {request?.comments
                    .map((comment) => comment?.message)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests?.length === 0 && (
          <section className="fixed w-48 h-auto p-4 transition-opacity duration-500 ease-in-out transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-md opacity-0 top-1/2 left-1/2 hover:opacity-100">
            <h1 className="mb-4 font-bold text-center">REQUESTS STATUS</h1>
            <p className="text-center">No Requests to display</p>
          </section>
        )}
      </section>
    </section>
  );
};

export default RequestsTable;
