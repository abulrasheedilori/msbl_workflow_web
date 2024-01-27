import { FilteredReqType, RequestResponseType } from "../store/apiTypes";

const formatDate = (input: string) => {
  if (!input) return "NA";
  const config: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const date = new Date(input);
  const formatter = new Intl.DateTimeFormat("en-US", config);
  const formattedDate = formatter.format(date);

  // console.log("FORMATTED_DATE: ", formattedDate);
  return formattedDate;
};
export default formatDate;

export const loadSelectedRequest = (
  listOfRequest: RequestResponseType[],
  id: string
) => {
  const filteredRequest = listOfRequest.filter(
    (item: RequestResponseType) => item.id === parseInt(id)
  );
  return filteredRequest[0];
};

export const resolveRequestQueries = (filteredReq: FilteredReqType): string => {
  const value = "";
  const {
    sortBy,
    clientName,
    initiatorName,
    startDate,
    endDate,
    requestType,
    requestStatus,
    page,
    pageSize,
  } = filteredReq;
  clientName && clientName.length > 0
    ? value.concat(`clientName=${clientName}&`)
    : value.concat(`clientName=&`);

  sortBy && sortBy.length > 0
    ? value.concat(`sortBy=${sortBy}&`)
    : value.concat(`clientName=&`);

  initiatorName && initiatorName.length > 0
    ? value.concat(`initiatorName=${initiatorName}&`)
    : value.concat(`initiatorName=&`);

  startDate && startDate.length > 0
    ? value.concat(`startDate=${startDate}&`)
    : value.concat(`startDate=&`);

  endDate && endDate.length > 0
    ? value.concat(`endDate=${endDate}&`)
    : value.concat(`endDate=&`);

  requestType && requestType.length > 0
    ? value.concat(`requestType=${requestType}&`)
    : value.concat(`requestType=&`);

  requestStatus && requestStatus.length > 0
    ? value.concat(`requestStatus=${requestStatus}&`)
    : value.concat(`requestStatus=&`);

  page && page > 0
    ? value.concat(`page=${page}&`)
    : value.concat(`page=${10}&`);

  pageSize && pageSize > 0
    ? value.concat(`pageSize=${pageSize}&`)
    : value.concat(`pageSize=${10}`);

  return value;
};
