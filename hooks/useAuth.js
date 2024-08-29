"use client";
import React from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  return auth || null;
};

export default useAuth;
