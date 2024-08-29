import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center px-7 flex-wrap gap-4 py-11">
      <Link
        href="#"
        className="bg-white text-text-color w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </Link>
      <Link
        href="#"
        className="bg-white text-text-color w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white"
      >
        1
      </Link>
      <Link
        href="#"
        className="bg-white text-text-color w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white"
      >
        2
      </Link>
      <Link
        href="#"
        className="bg-secondary text-white w-11 h-11 rounded-full flex items-center justify-center"
      >
        3
      </Link>
      <Link
        href="#"
        className="bg-white text-text-color w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white"
      >
        4
      </Link>
      <Link
        href="#"
        className="bg-white text-text-color w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white"
      >
        5
      </Link>
      <Link
        href="#"
        className="bg-white text-text-color w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </Link>
    </div>
  );
};

export default Pagination;
