"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Loader from "@/components/Loader";
import ReviewsForm from "@/components/ReviewsForm";
import StarRating from "@/components/StarRating";
import supabase from "@/lib/supabase";
import { extractImagePath } from "@/utils/extractImagePath";
import uploadImage from "@/utils/uploadImage";
import { ReviewsFormZod } from "@/zod/ReviewsFormZod";
import {
  EyeIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const Id = () => {
  const params = useParams();
  const [review, setReview] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("0");

  const { user, user_meta } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    getReview();
  }, [params]);
  const getReview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
              *,
              business (
                  id,
                  name
              ) 
          `
        )
        .eq("id", params.id)
        .single();
      if (error) throw error;
      setReview(data);
      setStatus(data.status);

      setValue("title", data.title);
      setValue("rating", data.rating);
      setValue("review", data.review);
      setImagesDB(data.review_files);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //   status dropdown
  const options = [
    { value: "0", label: "Pending", color: "yellow" },
    { value: "1", label: "Approved", color: "green" },
    { value: "2", label: "Rejected", color: "red" },
  ];
  const handleChange = async (e) => {
    setStatus(e.target.value);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: e.target.value })
        .eq("id", params.id);
      if (error) throw error;

      const notification_data = {
        recevier_id: review.user_id,
        notification_type: "reviews",
        notification_operation:
          e.target.value == "0"
            ? "pending"
            : e.target.value == "1"
            ? "approve"
            : "reject",
        related_entity_id: review.id,
      };
      const { error: notification_error } = await supabase
        .from("notification")
        .insert(notification_data);
      if (notification_error) throw notification_error;
    } catch (error) {
      console.log(error);
    }
  };

  const [edit, setEdit] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesDB, setImagesDB] = useState([]);
  const [customErrors, setCustomErrors] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(ReviewsFormZod),
  });
  const onSubmit = async (formData) => {
    try {
      let reviewData = {
        title: formData.title,
        review: formData.review,
        rating: formData.rating,
      };
      const { data: r_data, error: r_error } = await supabase
        .from("reviews")
        .update(reviewData)
        .eq("id", params.id);
      if (r_error) throw r_error;
      console.log("review_updated");

      if (images) {
        // upload review images
        const uploadReviewImages = await uploadImage(
          params.id,
          images,
          "reviews",
          `${params.id}/`
        );
        if (uploadReviewImages.error) throw uploadReviewImages.error;
        console.log(uploadReviewImages);
        let imagesUploadArr = uploadReviewImages
          .map((img) => img.url)
          .join(",");
        console.log(imagesUploadArr);
        if (imagesDB.split(",").length > 0)
          imagesUploadArr = imagesUploadArr + "," + imagesDB;

        // updating reviews table with images url
        const { data: updateImgsData, error: updateImgsError } = await supabase
          .from("reviews")
          .update({ review_files: imagesUploadArr })
          .eq("id", params.id)
          .select();
      }

      const notification_data = {
        recevier_id: review.user_id,
        notification_type: "reviews",
        notification_operation: "admin_update",
        related_entity_id: review.id,
      };
      const { error: notification_error } = await supabase
        .from("notification")
        .insert(notification_data);
      if (notification_error) throw notification_error;

      getReview();
      setEdit(false);
      setImages([]);
    } catch (error) {
      console.log(error);
    }
  };

  // delete
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ isArchived: true })
        .eq("id", params.id);
      if (error) throw error;

      const notification_data = {
        recevier_id: review.user_id,
        notification_type: "reviews",
        notification_operation: "admin_delete",
        related_entity_id: review.id,
      };
      const { error: notification_error } = await supabase
        .from("notification")
        .insert(notification_data);
      if (notification_error) throw notification_error;

      router.push("/dashboard/reviews");
    } catch (error) {
      console.log(error);
    }
  };

  // img delete
  const imgDelete = async (name) => {
    console.log(name);
    console.log([...imagesDB.split(","), ...images]);
    if (name.includes("http")) {
      try {
        setImagesDB(
          [...imagesDB.split(",").filter((img) => img !== name)].join(",")
        );
        const oldUrl = extractImagePath(name).replace("reviews/", "");
        const { data: oldUrlData, error: oldUrlError } = await supabase.storage
          .from("reviews")
          .remove([oldUrl]);
        if (oldUrlError) throw oldUrlError;
        const { data: updateImagesData, error: updateImagesError } =
          await supabase
            .from("reviews")
            .update({
              review_files: [
                ...imagesDB.split(",").filter((img) => img !== name),
              ].join(","),
            })
            .eq("id", params.id)
            .select();
        if (updateImagesError) throw updateImagesError;
        console.log(
          [...imagesDB.split(",").filter((img) => img !== name)].join(",")
        );
      } catch (error) {
        console.log("img del", error);
      }
    } else {
      setImages(images.filter((file) => file.name != name));
    }
    console.log(images);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-xl bg-white my-3 mx-auto">
          <div className="p-4 mb-3 border-b-2">
            {(user_meta.role === "super_admin" ||
              user.id == review.user_id) && (
              <div className="flex justify-between  mt-3 mb-5">
                {!edit && user_meta.role === "super_admin" ? (
                  <div className="relative inline-block cursor-pointer">
                    <select
                      value={status}
                      onChange={handleChange}
                      className={`pl-6 pr-4 py-1 border cursor-pointer rounded-md appearance-none focus:outline-none focus:ring-2 text-sm ${
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
                          className={` uppercase font-bold cursor-pointer ${
                            option.value == "0"
                              ? "text-yellow-500"
                              : option.value == "1"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
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
                ) : (
                  <div></div>
                )}

                <div className="flex gap-5">
                  <button
                    className="bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
                    onClick={handleDelete}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>

                  <button
                    className="bg-primary text-white w-7 h-7 rounded-full flex justify-center items-center"
                    title="edit"
                    onClick={() => setEdit(!edit)}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            {edit ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
              >
                <div className="">
                  <Formlabel text="Title" forLabel="title" />
                  <InputField
                    inputId="title"
                    inputName="title"
                    inputType="text"
                    register={register}
                    error={errors.title}
                  ></InputField>
                </div>

                <div className="">
                  <Formlabel text="Review" forLabel="review" />
                  <InputField
                    inputId="review"
                    inputName="review"
                    inputType="textarea"
                    register={register}
                    error={errors.review}
                  ></InputField>
                </div>

                <div className="mb-7">
                  <Formlabel text="Rating" forLabel="rating" />
                  <input type="hidden" {...register("rating")} />
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <StarIcon
                        key={value}
                        className={`h-5 w-5 text-gray-400 cursor-pointer hover:text-yellow-400 ${
                          watch("rating") >= value && "text-yellow-400"
                        }`}
                        onClick={() =>
                          setValue("rating", value, { shouldValidate: true })
                        }
                      />
                    ))}
                  </div>
                  {errors.rating && (
                    <span className="text-red-400 text-sm">
                      {errors.rating.message || "Please select a rating."}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <Formlabel text="Images" forLabel="images" />
                  <input
                    id="images"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      setImages([...images, ...Array.from(e.target.files)]);
                      setCustomErrors({
                        ...customErrors,
                        images: "",
                      });
                    }}
                    className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                    type="file"
                    name="images"
                    multiple
                  />
                  {(imagesDB || images.length > 0) && (
                    <div className="">
                      <span className="inline-block mt-4 mb-1">
                        Current Images:
                      </span>
                      <div className="flex gap-4 items-center flex-wrap">
                        {[...imagesDB.split(","), ...images].map(
                          (item, index) => (
                            <>
                              {item && (
                                <div className="relative h-full" key={index}>
                                  <Image
                                    key={index}
                                    src={
                                      typeof item == "string"
                                        ? item
                                        : URL.createObjectURL(item)
                                    }
                                    alt=""
                                    className="aspect-square rounded-sm  bg-white d-flex p-1"
                                    width={180}
                                    height={180}
                                  />
                                  <XMarkIcon
                                    className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                                    onClick={() =>
                                      imgDelete(
                                        typeof item == "string"
                                          ? item
                                          : item.name
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {customErrors.images && (
                    <span className="text-red-400 text-sm pl-1">
                      {customErrors.images}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="submit"
                    className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-center text-xs font-semibold py-4 w-full max-w-[200px] disabled:bg-gray-600 disabled:cursor-progress"
                    disabled={loading}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="rounded-full my-5 uppercase shadow-btnShadow outline-none border border-primary text-primary text-center text-xs font-semibold py-4 w-full max-w-[200px] disabled:bg-gray-600 disabled:cursor-progress"
                    onClick={() => setEdit(!edit)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-5">
                  On:
                  <Link
                    href={`/places/category/business/${review.business_id}`}
                    className="underline inline-block "
                  >
                    {review.business?.name}
                  </Link>
                  <br />
                  By: <Link href={""}> {review.user_email}</Link>
                </div>
                <StarRating rating={review.rating} />
                <h3 className="text-xl font-bold capitalize pt-1">
                  {review.title}
                </h3>
                <div className="pt-2 pb-4">{review.review}</div>
                {review.review_files &&
                  review.review_files.split(",").length && (
                    <div className="flex gap-3 flex-wrap">
                      {review.review_files.split(",").map((img, i) => (
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Id;
