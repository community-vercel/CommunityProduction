'use client';
import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  user: "",
  session: "",
  isAuthenticated: false, 
  user_meta:""
}

if (typeof window !== 'undefined') {
  initialState = JSON.parse(localStorage.getItem("auth")) || {
    user: "",
    session: "",
    isAuthenticated: false, 
    user_meta:""
  };
}
 

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setUserMeta: (state, action) => { 
      console.log(action)
      state.user_meta = action.payload.user_meta;
    }, 
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },  
  },
});

export const { setSession, setUser,setUserMeta,setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
