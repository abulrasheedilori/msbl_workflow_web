import { createSlice } from "@reduxjs/toolkit";
import {
  approveRequest,
  assignRoles,
  createRequest,
  deleteRequest,
  downloadRequestPdf,
  filterRequest,
  getAllRequestType,
  getAllRequestsFromAllUsers,
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
} from "../apiService";
import User, {
  LoginResponse,
  RequestResponseType,
  RequestTypeType,
} from "../apiTypes";

export interface AuthState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  user: LoginResponse | null;
  listOfRequest: RequestResponseType[];
  listOfUser: User[];
  userById: User | null;
  requestTypes: RequestTypeType[];
  isAuthenticated: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  loading: "idle",
  user: null,
  userById: null,
  listOfRequest: [],
  listOfUser: [],
  requestTypes: [],
  isAuthenticated: false,
  error: null,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.listOfRequest = [];
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        // console.log("ACTION_SUCCESSFUL: ", action.payload.data);
        state.loading = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.data.data;
        const stringValue = JSON.stringify(action.payload.data.data);
        localStorage.setItem("user", stringValue);
        state.message = action.payload.data.message;
      })
      .addCase(login.rejected, (state, action: any) => {
        // console.log("ACTION_REJECTED: ", action.payload);
        state.loading = "failed";
        state.error = "Invalid Login. Please, check and try again";
      })
      //signup
      .addCase(signup.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(signup.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error =
          action.payload.message ||
          "Sign Up a user failed. Please, check and try again";
      })

      //signup
      .addCase(updateUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(updateUser.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error =
          action.payload.message ||
          "Updating user failed. Please, check and try again";
      })

      //create request
      .addCase(createRequest.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(createRequest.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Creating Request Failed";
      })
      //get all requests by user with comments
      .addCase(getRequestsWithComments.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getRequestsWithComments.fulfilled, (state, action) => {
        state.listOfRequest = action.payload?.data?.data;
        state.loading = "succeeded";
      })
      .addCase(getRequestsWithComments.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error =
          action.payload.message || "Retrieving all requests Failed";
      })
      //post comment
      .addCase(postComment.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(postComment.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Posting comment Failed";
      })

      //update status
      .addCase(updateStatus.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(updateStatus.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Update Status Failed";
      })

      //delete request
      .addCase(deleteRequest.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(deleteRequest.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Delete Request Failed";
      })

      //get All RaquestTypes
      .addCase(getAllRequestType.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getAllRequestType.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.requestTypes = action.payload.data.data;
      })
      .addCase(getAllRequestType.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Get Request-types Failed";
      })

      //get All users
      .addCase(getAllUsers.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.listOfUser = action.payload.data.data;
      })
      .addCase(getAllUsers.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Getting all users Failed";
      })

      //get users by id
      .addCase(getUserById.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.userById = action.payload?.data?.data;
      })
      .addCase(getUserById.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Getting users Failed";
      })

      //get All requests from all users
      .addCase(getAllRequestsFromAllUsers.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getAllRequestsFromAllUsers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.listOfRequest = action.payload?.data?.data;
      })
      .addCase(getAllRequestsFromAllUsers.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error =
          action.payload.message ||
          "Getting all requests from all users Failed";
      })

      //Assign Roles to Users
      .addCase(assignRoles.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(assignRoles.fulfilled, (state, _action) => {
        state.loading = "succeeded";
      })
      .addCase(assignRoles.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error =
          action.payment.message || "Assigning roles to user Failed";
      })

      //Reset Password
      .addCase(resetPassword.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, _action) => {
        state.loading = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payment.message || "Reseting Password Failed";
      })

      //Approve Request
      .addCase(approveRequest.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(approveRequest.fulfilled, (state, _action) => {
        state.loading = "succeeded";
      })
      .addCase(approveRequest.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payment.message || "Request Approval Failed";
      })

      //Search by fields in Request
      .addCase(searchRequest.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(searchRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.listOfRequest = action.payload.data.data;
      })
      .addCase(searchRequest.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payment.message || "Request Search Failed";
      })

      // Filter Request
      .addCase(filterRequest.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(filterRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.listOfRequest = action.payload.data.data;
      })
      .addCase(filterRequest.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Filtering Request Failed";
      })

      //Download Filtered Request
      .addCase(downloadRequestPdf.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(downloadRequestPdf.fulfilled, (state, _action) => {
        state.loading = "succeeded";
      })
      .addCase(downloadRequestPdf.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error = action.payload.message || "Download Request Pdf Failed";
      })

      //Get Request By Id
      .addCase(getRequestById.pending, (state, _action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getRequestById.fulfilled, (state, _action) => {
        state.loading = "succeeded";
      })
      .addCase(getRequestById.rejected, (state, action: any) => {
        state.loading = "failed";
        state.error =
          action.payload.message || "Retrieving Request by Id Failed";
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
