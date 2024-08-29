"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination"; 
import { auth1, auth2, auth3, auth4 } from "@/assets";
import AuthSingleSlide from "./AuthSingleSlide";

const AuthSlider = () => {
  return (
    <div className="max-w-80 lg:max-w-xl mx-auto flex items-center flex-col justify-center lg:min-h-screen">
      <h1 className="text-white mb-7 lg:mb-14 text-center text-3xl lg:text-6xl">
        Welcome to the Community
      </h1>
      <div className="">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="swipperMain w-full max-w-80 md:max-w-xl "
        >
          <SwiperSlide>
            <AuthSingleSlide
              img={auth1}
              heading="Health"
              text="Find comprehensive healthcare resources and answers to your
          health-related questions. Access a directory of medical, dental, and
          specialist providers, filter by specialty or area, and navigate the
          healthcare system with ease."
                imgBG='#ffe2df'
            />
          </SwiperSlide>

          <SwiperSlide>
            <AuthSingleSlide
              img={auth2}
              heading="Education & Training"
              text="Find comprehensive healthcare resources and answers to your
          health-related questions. Access a directory of medical, dental, and
          specialist providers, filter by specialty or area, and navigate the
          healthcare system with ease."
            />
          </SwiperSlide>

          <SwiperSlide>
            <AuthSingleSlide
              img={auth3}
              heading="Travel"
              text="Find comprehensive healthcare resources and answers to your
          health-related questions. Access a directory of medical, dental, and
          specialist providers, filter by specialty or area, and navigate the
          healthcare system with ease."
            />
          </SwiperSlide>

          <SwiperSlide>
            <AuthSingleSlide
              img={auth4}
              heading="Work"
              text="Find comprehensive healthcare resources and answers to your
          health-related questions. Access a directory of medical, dental, and
          specialist providers, filter by specialty or area, and navigate the
          healthcare system with ease."
            />
          </SwiperSlide>
 
        </Swiper>
      </div>
    </div>
  );
};

export default AuthSlider;
