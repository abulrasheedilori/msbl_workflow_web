import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resolveRequestQueries } from "../utils/formatDate";
import User, {
  FilteredReqType,
  LoginType,
  PostCommentType,
  RequestReqType,
  RequestsListType,
  UpdateStatusRequestType,
  UserUpdate,
} from "./apiTypes";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: "http://localhost:8080/api",
  timeout: 60000,
});

//api or endpoints
const login = createAsyncThunk(
  "auth/signin",
  async (credentials: LoginType) => {
    try {
      const response = await api.post("/auth/signin", credentials);
      console.log("LOGIN_RESPONSE: ", response);
      return response;
    } catch (error: any) {
      console.log("LOGIN_ERROR: ", error);
      return error;
    }
  }
);

const signup = createAsyncThunk("auth/signup", async (user: User) => {
  try {
    const response = await api.post("/auth/signup", user);
    return response;
  } catch (error: any) {
    return error;
  }
});

const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (req: UserUpdate) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = user && JSON.parse(user);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.patch("/users", req, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const createRequest = createAsyncThunk(
  "request/createRequest",
  async (request: RequestReqType) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.post("/requests/create", request, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const getRequestsWithComments = createAsyncThunk(
  "request/getRequestsWithComments",
  async () => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.get("/requests/request-with-comments", {
        headers: auth,
      });
      // console.log("GET_REQUEST_WITH_COMMENTS: ", response.data);
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const postComment = createAsyncThunk(
  "request/postComment",
  async (comment: PostCommentType) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.post("/comments/post", comment, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const updateStatus = createAsyncThunk(
  "request/updateStatus",
  async (request: UpdateStatusRequestType) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.patch("/requests/status", request, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      console.log("UPDATE_STATUS_ERR: ", error);
      return error;
    }
  }
);

const approveRequest = createAsyncThunk(
  "request/approveRequest",
  async (request: { requestId: number; isApproved: boolean }) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.patch("/requests/approval", request, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const enableOrDisableUser = createAsyncThunk(
  "request/enableOrDisableUser",
  async (request: { email: string; isDisabled: boolean }) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.patch("/users/enable-or-disable", request, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const resetPassword = createAsyncThunk(
  "request/resetPassword",
  async (request: { email: string; newPassword: string }) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.patch("/users/resetpassword", request, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const deleteRequest = createAsyncThunk(
  "request/deleteRequest",
  async (requestId: number) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.delete(`/requests/${requestId}`, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

const getAllRequestType = createAsyncThunk(
  "request/getAllRequestType",
  async () => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.get(`/requestType`, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

//Get All Requests from All Users
const getAllRequestsFromAllUsers = createAsyncThunk(
  "request/getAllRequestsFromAllUsers",
  async () => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.get(`/requests`, {
        headers: auth,
      });
      // console.log("getAllRequestsFromAllUsers: ", response);
      return response;
    } catch (error: any) {
      // console.log("GET_ALL_REQUESTS_FROM_ALL_USERS: ", error);
      return error;
    }
  }
);

//Get All Users
const getAllUsers = createAsyncThunk("request/getAllUsers", async () => {
  try {
    const user = localStorage.getItem("user");
    const parsedAuth = JSON.parse(user!);
    const auth = { "x-access-token": `${parsedAuth.accessToken}` };
    const response = await api.get(`/users`, {
      headers: auth,
    });
    return response;
  } catch (error: any) {
    return error;
  }
});

const getUserById = createAsyncThunk(
  "request/getUserById",
  async (id: number) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.post(
        `/users`,
        { id },
        {
          headers: auth,
        }
      );
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

//Get All Roles
const getAllRoles = createAsyncThunk("request/getAllRoles", async () => {
  try {
    const user = localStorage.getItem("user");
    const parsedAuth = JSON.parse(user!);
    const auth = { "x-access-token": `${parsedAuth.accessToken}` };
    const response = await api.get(`/roles`, {
      headers: auth,
    });
    return response;
  } catch (error: any) {
    return error;
  }
});

//Assign Roles
const assignRoles = createAsyncThunk(
  "request/assignRoles",
  async (request: { email: string; roles: string[] }) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.post(`/roles/assign`, request, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

//Search Requests
const searchRequest = createAsyncThunk(
  "request/searchRequest",
  async (searchItem: string) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.get(
        `/requests/search?searchItem=${searchItem}`,
        {
          headers: auth,
        }
      );
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

//Search Requests
const filterRequest = createAsyncThunk(
  "request/filterRequest",
  async (filteredReq: FilteredReqType) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.get(
        `/requests/filter?${resolveRequestQueries(filteredReq)}`,
        {
          headers: auth,
        }
      );
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

//Download filtered or searched Requests as pdf
const downloadRequestPdf = createAsyncThunk(
  "request/downloadRequestPdf",
  async (request: RequestsListType) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.post(`/requests/pdf`, request, {
        headers: auth,
      });
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

//Download filtered or searched Requests as pdf
const getRequestById = createAsyncThunk(
  "request/getRequestById",
  async (requestId: number) => {
    try {
      const user = localStorage.getItem("user");
      const parsedAuth = JSON.parse(user!);
      const auth = { "x-access-token": `${parsedAuth.accessToken}` };
      const response = await api.get(`/requests/${requestId}`, {
        headers: auth,
      });
      console.log("GET_REQUEST_BY_ID:", response);
      return response;
    } catch (error: any) {
      return error;
    }
  }
);

export default api;
export {
  approveRequest,
  assignRoles,
  createRequest,
  deleteRequest,
  downloadRequestPdf,
  enableOrDisableUser,
  filterRequest,
  getAllRequestType,
  getAllRequestsFromAllUsers,
  getAllRoles,
  getAllUsers,
  getRequestById,
  getRequestsWithComments,
  getUserById,
  login,
  postComment,
  resetPassword,
  searchRequest,
  signup,
  updateStatus,
  updateUser,
};
