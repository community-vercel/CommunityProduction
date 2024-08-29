"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Main = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Sidebar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <div className={`main lg:ml-24 transition-all duration-300 ${openDrawer && 'lg:!ml-[320px]'}`}>
        <Header />
        {children}
      </div>
    </>
  );
};

export default Main;
