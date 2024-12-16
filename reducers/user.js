import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { username: null, email: null, token: null, _id: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.username = action.payload.username;      
      state.value.email = action.payload.email;
      state.value.token = action.payload.token;
      state.value._id = action.payload._id;
    },
    logout: (state) => {
      state.value.username = null;
      state.value.email = null;
      state.value.token = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;