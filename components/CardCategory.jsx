import Image from "next/image";
import Link from "next/link";
import React from "react";

const CardCategory = ({ url, img, title, des }) => {
  return (
    <Link
      href={url}
      className="flex-[170px] lg:flex-grow-0 lg:w-[19%] lg:flex-[19%] bg-white p-3 rounded-xl"
    >
      <Image
        src={img}
        className="rounded-lg !w-full !aspect-video"
        alt=""
        width={300}
        height={300}
      />

      <h3 className="uppercase text-text-color text-base text-center font-semibold mt-4 mb-3">
        {title}
      </h3>
      <span className="text-text-gray text-base text-center inline-block mb-3 w-full">
        {des}
      </span>
    </Link>
  );
};

export default CardCategory;
