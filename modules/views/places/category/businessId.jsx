"use client";
import { inner, twitter } from "@/assets";
import ListTopBanner from "@/components/ListTopBanner";
import supabase from "@/lib/supabase";
import {
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import ReviewsForm from "@/components/ReviewsForm";
import StarRating from "@/components/StarRating";

const BusinessId = () => {
  const [business, setBusiness] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const params = useParams();

  const { user, user_meta } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    async function fetchBusinessDetails() {
      try {
        setLoading(true);

        // Fetch business details
        const { data, error } = await supabase
          .from("business")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        if (data.approved !== "1" && user && data.user_id == user.id) {
          console.log("not approved but owner");
        } else if (
          data.approved !== "1" &&
          user &&
          user_meta.role === "super_admin"
        ) {
          console.log("system owner");
        } else if (data.approved !== "1") {
          console.log("not approved");
          router.push("/");
        } else {
          console.log("approved");
        }

        setBusiness(data);
        console.log(data);
        setStatus(data.approved);

        if (user.id) {
          const { data: haveData, error: haveError } = await supabase
            .from("favorite")
            .select("*")
            .eq("user_id", user.id)
            .eq("business_id", data.id)
            .single();

          if (haveData && haveData.id) {
            setIsFavorite(!isFavorite);
          }
        }

        setLoading(false);

        const { data: categoryBusinessData, error: categoryBusinessError } =
          await supabase
            .from("category_business")
            .select("category(id,name)")
            .eq("business_id", params.id)
            .eq("category.isArchived", false);

        if (categoryBusinessError) throw categoryBusinessError;
        setCategories(
          categoryBusinessData.filter((item) => item.category !== null)
        );
        const { data: reviewsBusinessData, error: reviewsBusinessError } =
          await supabase
            .from("reviews")
            .select("*")
            .eq("business_id", params.id)
            .eq("status", "1")
            .eq("isArchived", false);

        if (reviewsBusinessError) throw reviewsBusinessError;
        setReviews(reviewsBusinessData);
        console.log(reviewsBusinessData);

        const { data: statsData, error: statsError } = await supabase.rpc(
          "get_rating_stats",
          { business_id_param: params.id }
        );

        if (statsError) throw statsError;
        console.log(statsData);
        setStats(statsData);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchBusinessDetails();
  }, [params.id, user]);

  // status change dropdown code
  const [status, setStatus] = useState("0");
  const options = [
    { value: "0", label: "Pending", color: "yellow" },
    { value: "1", label: "Approve", color: "green" },
    { value: "2", label: "Reject", color: "red" },
  ];
  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    handleStatusChange(e);
  };
  const handleStatusChange = async (e) => {
    console.log(e.target.value);
    try {
      const { error } = await supabase
        .from("business")
        .update({ approved: e.target.value })
        .eq("id", business.id);
      if (error) throw error;

      const notification_data = {
        recevier_id: business.user_id,
        notification_type: "business",
        notification_operation:
          e.target.value == "0"
            ? "pending"
            : e.target.value == "1"
            ? "approve"
            : "reject",
        related_entity_id: business.id,
      };
      const { error: notification_error } = await supabase
        .from("notification")
        .insert(notification_data);
      if (notification_error) throw notification_error;
    } catch (error) {
      console.log(error);
    }
  };

  // delete
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("business")
        .update({ isArchived: true })
        .eq("id", business.id);
      if (error) throw error;

      let notification_operation;
      let recevier_id;
      if (user_meta.role == "super_admin") {
        notification_operation = "admin_delete";
        recevier_id = business.user_id;
      } else {
        notification_operation = "user_delete";
        recevier_id = "admin";
      }
      const notification_data = {
        recevier_id,
        notification_type: "business",
        notification_operation,
        related_entity_id: business.id,
      };
      const { error: notification_error } = await supabase
        .from("notification")
        .insert(notification_data);
      if (notification_error) throw notification_error;

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  // favroite
  const toggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      const { data: haveData, error: haveError } = await supabase
        .from("favorite")
        .select("*")
        .eq("user_id", user.id)
        .eq("business_id", business.id)
        .single();

      if (haveData && haveData.id) {
        const { data: delData, error: delError } = await supabase
          .from("favorite")
          .delete()
          .eq("id", haveData.id)
          .select();
        if (delError) throw error;
      } else {
        const { data, error } = await supabase
          .from("favorite")
          .insert({ user_id: user.id, business_id: business.id })
          .select();
        if (error) throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="">Loading</div>
      ) : (
        <div>
          <div className="relative">
            {(user_meta.role === "super_admin" ||
              user.id == business.user_id) && (
              <div className="fixed z-10 right-5 top-[130px] flex gap-2 flex-wrap">
                <button
                  className="bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
                  onClick={handleDelete}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>

                <Link
                  href={`/dashboard/business/update/${business.id}`}
                  className="bg-primary text-white w-7 h-7 rounded-full flex justify-center items-center"
                  title="edit"
                >
                  <PencilIcon className="w-5 h-5" />
                </Link>

                {user_meta.role === "super_admin" && (
                  <div className="relative inline-block cursor-pointer">
                    <select
                      value={status}
                      onChange={handleChange}
                      className={`pl-6 pr-4 text-sm py-1 border cursor-pointer rounded-md appearance-none focus:outline-none focus:ring-2 ${
                        status == "0"
                          ? "text-yellow-500"
                          : status == "1"
                          ? "text-green-500"
                          : "text-red-500"
                      } font-bold uppercase`}
                    >
                      {options.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className={`text-${option.color}-600 uppercase font-bold cursor-pointer`}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                        status == "0"
                          ? "bg-yellow-500"
                          : status == "1"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            )}

            <ListTopBanner
              img={business.images ? business.images.split(",")[0] : inner}
              heading={business.name}
              label={categories.length && categories[0].category.name}
              website={business.website}
              call={business.phone}
              direction=""
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              user_id={user.id || null}
            />
          </div>

          <div className="px-7 py-16 flex flex-col lg:flex-row gap-5">
            <div className="md:flex-[25%]">
              <div className=" bg-white p-8 rounded-3xl">
                <div className="flex gap-3 items-center">
                  <div className="p-1 rounded-md bg-[#F1F3F6]">
                    <MapPinIcon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-[#1E1E1F] text-sm  leading-6">
                    {business.location ? business.location : "No location data"}
                  </span>
                </div>

                <div className="flex gap-3 items-center mt-5">
                  <div className="p-1 flex items-center justify-center w-[2.3rem] h-[2.3rem] rounded-md bg-[#F1F3F6]">
                    <EnvelopeIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[#1E1E1F] text-sm  leading-6">
                    {business.email ? business.email : "No email provided"}
                  </span>
                </div>

                {business.socials && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-5 text-text-color">
                      Social Media
                    </h3>

                    <div className="flex gap-2 flex-wrap">
                      {business.socials.facebook && (
                        <Link
                          href={business.socials.facebook}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            f
                          </span>
                        </Link>
                      )}

                      {business.socials.instagram && (
                        <Link
                          href={business.socials.instagram}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            i
                          </span>
                        </Link>
                      )}

                      {business.socials.tiktok && (
                        <Link
                          href={business.socials.tiktok}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            t
                          </span>
                        </Link>
                      )}

                      {business.socials.youtube && (
                        <Link
                          href={business.socials.youtube}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <span className="text-primary font-bold text-xl text-center">
                            Y
                          </span>
                        </Link>
                      )}

                      {business.socials.twitter && (
                        <Link
                          href={business.socials.twitter}
                          className="p-2 flex items-center justify-center rounded-md w-9 h-9 bg-[#F1F3F6]"
                          target="_blank"
                        >
                          <Image src={twitter} alt="" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:flex-[75%] ">
              {business.discount_code && (
                <div className="bg-white py-8 px-8 mb-4  rounded-3xl text-green-400">
                  {business.discount_message ? (
                    <span className="">
                      {business.discount_message
                        .split("[code]")
                        .map((part, index) => (
                          <React.Fragment key={index}>
                            {part}
                            {index === 0 && (
                              <span className="font-bold">
                                {business.discount_code}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                    </span>
                  ) : (
                    <span>
                      Discount code:{" "}
                      <span className="font-bold">
                        {business.discount_code}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {business.images && business.images.split(",").length > 1 && (
                <div className="bg-white mb-8 rounded-3xl">
                  <Swiper
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="swipperMain w-full max-w-80 md:max-w-xl "
                  >
                    {business.images.split(",").map((img, index) => (
                      <>
                        {img && (
                          <SwiperSlide key={index}>
                            <Image
                              src={img}
                              className="flex rounded-md !w-full"
                              width={1000}
                              height={1000}
                              alt=""
                            />
                          </SwiperSlide>
                        )}
                      </>
                    ))}
                  </Swiper>
                </div>
              )}

              <div className="bg-white p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-3 text-text-color">
                  Business Details
                </h3>
                <p className="text-sm leading-6">
                  <strong>ABOUT</strong>
                  <br />
                  {business.description}
                </p>

                <p className="text-sm leading-6 mt-3">
                  <strong className="uppercase">Categories</strong>
                  <br />
                  {categories.map((item, index) => (
                    <Link
                      href={`/places/category/${item.category.id}`}
                      key={item.category.id}
                    >
                      <span href={`/places/category/${item.category.id}`}>
                        {item.category.name}
                      </span>
                      {index < categories.length - 1 && ", "}
                    </Link>
                  ))}
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl mt-7">
                {user.id ? (
                  <>
                    {!showReviewForm && (
                      <div className="flex justify-between flex-wrap gap-4 items-center">
                        <span className="text-bold">
                          Give us your valueable review
                        </span>
                        <button
                          className="py-2 px-6 inline-block rounded-full border border-primary text-primary "
                          onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                          Write
                        </button>
                      </div>
                    )}
                    {showReviewForm && (
                      <ReviewsForm
                        business_id={business.id}
                        user_id={user.id}
                        user_email={user.email}
                        showReviewForm={showReviewForm}
                        setShowReviewForm={setShowReviewForm}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex justify-between flex-wrap gap-4 items-center">
                    <span className="text-bold">
                      You need to logged in to give review.
                    </span>
                    <Link
                      href="/login"
                      className="py-2 px-6 inline-block rounded-full border border-primary text-primary "
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>

              {reviews.length > 0 && (
                <div className="bg-white p-8 rounded-3xl mt-7">
                  <div className="flex justify-between flex-wrap gap-3 items-center">
                    <h3 className="text-xl font-bold mb-3 text-text-color">
                      Customer Reviews
                    </h3>
                    <div className="flex justify-end flex-col">
                      <StarRating rating={stats[0]?.avg_rating} />
                      <h5 className="">
                        Rating{" "}
                        <span className="font-bold text-2xl">
                          {stats[0]?.avg_rating.toFixed(1)}
                        </span>
                        <span className="font-bold text-sm">/5.0</span> from{" "}
                        <span className="font-bold text-2xl">
                          {stats[0]?.total_count}
                        </span>{" "}
                        review(s)
                      </h5>
                    </div>
                  </div>

                  <div className="mt-2">
                    {reviews.map((review) => {
                      return (
                        <div className="py-3 mb-3 border-b-2" key={review.id}>
                          <StarRating rating={review.rating} />
                          <h3 className="text-xl font-bold capitalize pt-1">
                            {review.title}
                          </h3>
                          <div className="pt-2 pb-4">{review.review}</div>
                          {review.review_files &&
                            review.review_files.split(",").length && (
                              <div className="flex gap-3 flex-wrap">
                                {review.review_files
                                  .split(",")
                                  .map((img, i) => (
                                    <>
                                      {img && (
                                        <Image
                                          src={img}
                                          alt=""
                                          key={i}
                                          width={200}
                                          height={200}
                                          className="flex-grow-0 aspect-square rounded-sm"
                                        />
                                      )}
                                    </>
                                  ))}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white mt-7 p-8 rounded-3xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d27681.669739967132!2d-95.406134!3d29.858254!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1720607927415!5m2!1sen!2sus"
                  width="100%"
                  height="450"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessId;
