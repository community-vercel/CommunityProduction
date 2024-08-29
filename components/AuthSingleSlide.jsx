 
import Image from "next/image";
import React from "react";

const AuthSingleSlide = ({ img, heading, text, imgBG }) => {
  return (
    <div className="bg-white mx-1 p-7 w-auto lg:p-14 flex flex-col gap-10 justify-center items-center rounded-[32px] mb-11">
      <Image src={img} alt="" className={`bg-[${imgBG}]`}/>
      <div className="">
        <h3 className="text-xl mb-2 lg:text-4xl lg:mb-5 text-text-color text-center font-medium">
          {heading}
        </h3>
        <p className="text-sm lg:text-lg text-center text-text-color break-words">
          {text}
        </p>
      </div>
    </div>
  );
};

export default AuthSingleSlide;
