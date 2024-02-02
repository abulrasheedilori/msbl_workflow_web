import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  filterRequest,
  getAllRequestsFromAllUsers,
} from "../../store/apiService";
import { FilteredReqType, RequestType } from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

class ExtendedPDF extends jsPDF {
  autoTable = (options: object) => {
    // @ts-ignore
    jsPDF.API.autoTable.apply(this, [this, options]);
  };
}
interface RequestsTableProps {
  requests: RequestType[];
}

const RequestsTable = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const dispatch = useAppDispatch();
  const { listOfRequest } = useAppSelector((state) => state.auth);
  const [requests, setRequests] = useState<any>(listOfRequest);

  useEffect(() => {
    dispatch(getAllRequestsFromAllUsers());
    console.log(
      "REQUEST_TABLE-LIST_OF_REQUESTS BEFORE MOUNTING: ",
      listOfRequest
    );
  }, [dispatch]);

  const flattenRequests = listOfRequest?.flatMap((request) => {
    const { comments, user, ...rest } = request;
    const sortedComments = comments
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((comment) => comment.message + `[${comment.createdAt}]`)
      .join(", ");

    return [
      {
        ID: request?.id,
        TITLE: request?.title,
        "REQUEST STATUS": request.status,
        "CLIENT NAME": request?.clientName,
        "CLIENT EMAIL": request?.clientEmail,
        "CLIENT MOBILE": request?.clientMobile,
        "APPROVAL STATUS": request?.isApproved ? "APPROVED" : "NOT_APPROVED",
        INITIATOR: request?.user.firstname + " " + request?.user.lastname,
        "INITIATOR MOBILE": request?.user.mobile,
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
      "requests_audit_for_" + new Date().toUTCString() + ".xlsx"
    );
  };

  const validateDates = async () => {
    if (startDate === "" || endDate === "") {
      return setDateError("Neither start date/end date must be empty!");
    }
    setDateError("");
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (endDateObj < startDateObj) {
      setDateError("End Date must not be before Start Date.");
      setEndDate("");
      return;
    }

    setDateError("");
    const filterReq: FilteredReqType = {
      startDate,
      endDate,
    };
    dispatch(filterRequest(filterReq))
      .then(() => {
        setStartDate("");
        setEndDate("");
      })
      .catch((error: any) => setDateError(error.message));
  };

  const handleStartDate = (e: any) => {
    setStartDate(e.target.value);
    e.target.blur();
  };
  const handleEndDate = (e: any) => {
    setEndDate(e.target.value);
    e.target.blur();
  };

  return (
    <section className="w-screen h-[90vh] lg:p-8 lg:pt-8 scroll-smooth">
      <section className="w-full lg:static lg:bg-transparent">
        <section className="p-4">
          <header className="my-4 text-xl font-bold text-black text-start lg:text-4xl">
            Audit Requests
          </header>
          <p className="text-xs lg:text-lg">
            You can filter all requests here and export it as an excel sheet for
            auditing purpose.
          </p>
        </section>
        <section className="flex flex-col justify-center w-full gap-1 p-4 mt-0 lg:mt-8 lg:items-center lg:flex-row">
          {/* <SearchFilter /> */}
          <section className="flex flex-col justify-start gap-2 lg:flex-row">
            <section className="flex flex-col gap-2 lg:flex-row flex-start">
              <input
                className="w-full lg:w-[12vw] p-2 h-[40px] focus:border-green-600 outline-none border-2 border-slate-200 rounded-lg shadow-sm"
                type="datetime-local"
                value={startDate}
                onChange={(e) => handleStartDate(e)}
                onBlur={validateDates}
              />
              <input
                className="w-full mx-auto p-2 lg:w-[12vw] lg:mx-0 h-[40px] border-2 focus:border-green-600 outline-none border-slate-200 rounded-lg shadow-sm"
                type="datetime-local"
                value={endDate}
                onChange={(e) => handleEndDate(e)}
                onBlur={validateDates}
              />
              <button className="p-2 font-serif font-bold text-white bg-green-900 border border-green-800 rounded-lg hover:bg-green-600">
                Filter
              </button>
            </section>
            <section className="flex flex-row gap-4 flex-start">
              <button
                className="w-full p-2 font-serif font-bold text-green-900 bg-yellow-400 border border-green-800 rounded-lg lg:w-auto hover:bg-green-600"
                onClick={exportToExcel}
              >
                Export to Excel
              </button>
              {/* <button
                className="p-2 font-serif font-bold text-green-900 bg-red-400 border border-green-800 rounded-lg hover:bg-green-600"
                onClick={exportToPDF}
              >
                Export to PDF
              </button> */}
            </section>
          </section>
        </section>
        <p className="pb-4 text-xs text-center text-red-500">{dateError}</p>
      </section>
      <section className="w-full h-full lg:w-[85vw] lg:h-[73vh] overflow-auto">
        <table className="mx-auto bg-white border border-gray-300">
          <thead>
            <tr className="border border-gray-300 bg-slate-50 text-nowrap">
              <th className="flex-1 px-2 py-1 text-center border-b">ID</th>
              <th className="px-2 py-1 text-center border-b flex-3">TITLE</th>
              <th className="flex-1 px-2 py-1 text-center border-b">STATUS</th>
              <th className="flex-1 px-2 py-1 text-center border-b">NAME</th>
              <th className="flex-1 px-2 py-1 text-center border-b">EMAIL</th>
              <th className="flex-1 px-2 py-1 text-center border-b">MOBILE</th>
              <th className="flex-1 px-2 py-1 text-center border-b">
                APPROVAL
              </th>
              <th className="flex-1 px-2 py-1 text-center border-b">
                INITIATOR
              </th>
              <th className="flex-1 px-2 py-1 text-center border-b">
                INITIATOR MOBILE
              </th>
              <th className="px-2 py-1 text-center border-b flex-3">
                REQUEST TYPE
              </th>
              <th className="flex-1 px-2 py-1 text-center border-b">
                CREATED AT
              </th>
              <th className="flex-1 px-2 py-1 text-center border-b">
                LAST COMMENTS
              </th>
            </tr>
          </thead>

          <tbody>
            {listOfRequest?.map((request) => (
              <tr
                key={request.id}
                className=" text-nowrap hover:bg-green-900 hover:text-green-50"
              >
                <td className="flex-1 border-b">{request.id}</td>
                <td className="py-2 border-b flex-3">{request.title}</td>
                <td className="flex-1 py-2 border-b">
                  {request.status.toLocaleUpperCase()}
                </td>
                <td className="flex-1 py-2 border-b">{request.clientName}</td>
                <td className="flex-1 py-2 border-b">{request.clientEmail}</td>
                <td className="flex-1 py-2 border-b">{request.clientMobile}</td>
                <td className="flex-1 py-2 border-b">
                  {request.isApproved ? "APPROVED" : "NOT_APPROVED"}
                </td>
                <td className="flex-1 py-2 border-b">
                  {request.user.firstname + " " + request.user.lastname}
                </td>
                <td className="flex-1 py-2 border-b">{request.user.mobile}</td>
                <td className="py-2 border-b flex-3">{request.reqType}</td>
                <td className="flex-1 py-2 border-b">
                  {new Date(request.createdAt).toUTCString()}
                </td>
                <td className="flex-1 py-2 border-b">
                  {request.comments
                    .map((comment) => comment.message)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {listOfRequest.length === 0 && (
          <section className="w-48 h-auto p-4 mx-auto mt-16 bg-white rounded-md shadow-md">
            <h1 className="mb-4 font-bold text-center"> REQUESTS STATUS</h1>
            <p className="text-center">No Requests to display</p>
          </section>
        )}
      </section>
    </section>
  );
};

export default RequestsTable;
