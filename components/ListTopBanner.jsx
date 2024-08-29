"use client";
import { HeartIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react"; 

const ListTopBanner = ({ img, label, heading,website,call,direction,user_id,isFavorite,toggleFavorite}) => {

  

 

  return (
    <div className="relative min-h-[460px]">
      <div className="">
        <Image
          src={img}
          alt=""
          className="h-full min-h-[460px] w-full object-cover"
          width={1000}
          height={1000}
        />
        <span className="bg-overlay absolute top-0 left-0 w-full h-full"></span>
      </div>
      

      <div className="absolute px-7 z-20 bottom-10 w-full sm:bottom-16">
        {label && (
        <span className="text-xl lg:text-2xl inline-block font-bold px-5 py-2 text-white bg-[#b0acac] rounded-md">
            {label}
        </span>
        )}
        <h1 className={`text-4xl lg:text-7xl text-white font-bold mt-4 mb-6 lg:mb-[60px] flex flex-wrap gap-2 items-center`}>
          <span>{heading}</span>
          {user_id ? (
          <button
            className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mt-1`}
            onClick={()=>toggleFavorite()}
          >
            <HeartIcon className={`w-7 h-7 ${isFavorite ? "text-red-500" : "text-black"}`} />
          </button>
        ) : (
          <Link
            href="/login"
            className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mt-1`}
          >
            <HeartIcon className={`w-7 h-7 text-black`} />
          </Link>
        )}
        </h1>
        <div className="flex gap-5 flex-col sm:flex-row">
            {website && (
                <Link href={website} className="inline-block text-center text-lg lg:text-2xl font-medium md:py-3 px-8 py-2 text-text-color bg-[#f1f3f6] border border-primary rounded-full duration-300 hover:text-white hover:bg-primary">Website</Link>
            )}
            {call && (
                <Link href={`tel:${call}`} className="inline-block text-center text-lg lg:text-2xl font-medium md:py-3 px-8 py-2 text-text-color bg-[#f1f3f6] border border-primary rounded-full duration-300 hover:text-white hover:bg-primary">Call</Link>
            )}
            {direction && (
                <Link href={direction} className="inline-block text-center text-lg lg:text-2xl font-medium md:py-3 px-8 py-2 text-text-color bg-[#f1f3f6] border border-primary rounded-full duration-300 hover:text-white hover:bg-primary">Directions</Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default ListTopBanner;
