import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    projectId: null,
    username: null,
    email: null,
    tokenProject: null,
    role: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      // console.log(`- dans Redux: loginUser 🔔`);
      state.value.token = action.payload.token;
      state.value.projectId = action.payload.projectId;
      state.value.tokenProject = action.payload.tokenProject;
      state.value.username = action.payload.username;
      state.value.role = action.payload.role;
      state.value.email = action.payload.email;
    },
    logoutUser: (state) => {
      // console.log(`- dans Redux: logoutUser 🔔`);
      state.value.token = null;
      state.value.projectId = null;
      state.value.tokenProject = null;
      state.value.username = null;
      state.value.role = null;
      state.value.email = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
