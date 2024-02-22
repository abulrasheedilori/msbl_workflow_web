type User = {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  roles: string[];
  isDisabled?: boolean;
};
export default User;

export type ApprovalStatusPropType =
  | "AWAITING_APPROVAL"
  | "APPROVED"
  | "DECLINED";
export type UserUpdate = {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  mobile: string;
};

export type ResponseData = {
  data: ResponseData;
  message: string;
};

export type LoginResponse = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  mobile: string;
  roles: string[];
  accessToken: string;
  refreshToken?: string;
  expires?: number;
};

export type RequestReqType = {
  title: string;
  message: string;
  clientName: string;
  clientEmail: string;
  clientMobile: string;
  requestTypeId: number;
  documentUrl: string;
  debitAuthorizationUrl: string;
  status: string;
  narration: string;
  isApproved: boolean;
};

export type PdfRequestsType = {
  requests: RequestReqType[];
};

export type RequestTypeType = {
  id: number;
  title: string;
  description: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
};

export type PostCommentType = { message: string; requestId: number };

export type CommentType = { message: string };
export type CommentResponseType = CommentType & {
  id: number;
  userId: number;
  user: User;
  createdAt: string;
  updatedAt: string;
};

export type RequestResponseType =
  | RequestReqType & {
      id: number;
      comments: CommentResponseType[];
      createdAt: string;
      updatedAt: string;
      reqType: string;
      requestTypeId: number;
      userId: number;
      user: User;
      requestType: RequestTypeType;
    };

export type StatusUpdatePropsType = {
  message: string;
  title?: string;
  status: "succeeded" | "pending" | "failed";
};

export type UpdateStatusRequestType = {
  requestId: number;
  status: string;
};

export type FilteredReqType = {
  sortBy?: string;
  startDate: string;
  endDate: string;
  clientName?: string;
  requestType?: string;
  requestStatus?: string;
  initiatorName?: string;
  page?: number;
  pageSize?: number;
};

export type StatusUpdateLayoutPropType = {
  statusUpdate: StatusUpdatePropsType;
  setStatusUpdate: (input: StatusUpdatePropsType | null) => void;
};
export type LoginType = { username: string; password: string };
export type AuthToggleProps = {
  setToggleAuth: (toggle: boolean) => void;
};

export type RequestType = {
  id: number;
  title: string;
  message: string;
  status: string;
  clientName: string;
  clientEmail: string;
  clientMobile: string;
  isApproved: boolean;
  reqType: string;
  documentUrl: string;
  debitAuthorizationUrl: string;
  narration: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  requestTypeId: number;
};

export type RequestsListType = {
  requests: RequestType[];
};
