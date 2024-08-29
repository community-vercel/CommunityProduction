"use client";
import Image from "next/image";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";

const TopBanner = ({ img, label, heading, btnTxt, invert, back }) => {
  const router = useRouter();
  const { user, user_meta } = useSelector((state) => state.auth);

  let btn;
  if ((user_meta.role == "business" || user_meta.role == "super_admin") && user.id) {
    btn = (
      <Link
        href="/dashboard/business"
        className={`${invert ? "bg-white text-black text-center text-sm duration-300 rounded-full py-2 px-7 border-2 border-primary hover:bg-primary hover:text-white": "bg-primary text-white text-center text-base rounded-full py-2 px-9 border-8 border-white"}`}
      >
        {btnTxt}
      </Link>
    );
  }else if(!user.id){
    btn = (
      <Link
        href="/login"
        className={`${invert ? "bg-white text-black text-center text-sm duration-300 rounded-full py-2 px-7 border-2 border-primary hover:bg-primary hover:text-white": "bg-primary text-white text-center text-base rounded-full py-2 px-9 border-8 border-white"}`}
      >
        Login
      </Link>
    );
  }
  return (
    <div className="relative min-h-[260px] max-h-[260px]">
      <div className="">
        <Image
          src={img}
          alt=""
          className="h-full min-h-[260px] max-h-[260px] w-full object-cover"
          width={1000}
          height={1000}
        />
        <span className="bg-overlay absolute top-0 left-0 w-full h-full z-[1]"></span>
      </div>
      <span className="absolute z-[2] font-semibold text-center w-[300px] top-[10px] bg-[#44C577] text-xl tracking-normal rotate-[-30deg] left-[-90px] py-2 text-white">
        {label}
      </span>

      <div className="absolute px-7 z-20 flex flex-col gap-5 bottom-8 md:flex-row md:gap-0 justify-between items-center w-full sm:bottom-12">
        <h1
          className={`text-2xl text-white font-bold ${
            back && "flex gap-4 items-center cursor-pointer"
          }`}
          onClick={() => {
            back && router.back();
          }}
        >
          {back && (
            <ChevronLeftIcon className="h-8 w-8 text-white rounded-full border-2 border-white" />
          )}

          <span>{heading}</span>
        </h1>
        {btn}
      </div>
    </div>
  );
};

export default TopBanner;
