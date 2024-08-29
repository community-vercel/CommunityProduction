'use client'
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";

const MenuDropDown = ({ openDrawer, text, icon, children }) => {
    const [showMenu,setShowMenu] = useState(false)
  return (
    <>
      <button
        className={`flex relative  py-3 justify-center items-center w-full ${
          openDrawer === true && "!justify-normal"
        }`}
        onClick={()=>setShowMenu(!showMenu)}
      >
        {icon}
        <span
          className={`text-white absolute pointer-events-none left-8 min-w-[300px] text-left transition-all duration-300 text-[15px] pl-3 w-full hover:text-primary opacity-0 ${
            openDrawer === true && "!opacity-100 pointer-events-auto"
          }`}
        >
          {text}
        </span>
        {openDrawer === true && <ChevronDownIcon className={`w-5 h-5 text-white absolute right-0 transition-all duration-300 ${showMenu ? 'rotate-[180deg] ' : '' }`}/>}
        
      </button>

      <div className={`transition-all duration-300  ${showMenu ? 'opacity-1 h-auto' : 'opacity-0 h-0'}`}>{children}</div>
    </>
  );
};

export default MenuDropDown;
