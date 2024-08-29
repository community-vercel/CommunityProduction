"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import uploadImage from "@/utils/uploadImage";
import { ReviewsFormZod } from "@/zod/ReviewsFormZod";
import Formlabel from "./Formlabel";
import InputField from "./InputField";
import { StarIcon, XMarkIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useSelector } from "react-redux";
import supabase from "@/lib/supabase";

const ReviewsForm = ({
  business_id,
  user_id,
  showReviewForm,
  setShowReviewForm,
  user_email,
}) => {
  const [images, setImages] = useState([]);
  const [customErrors, setCustomErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const {user_meta} = useSelector(state=>state.auth)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(ReviewsFormZod),
    defaultValues: {
      rating: 0,
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      let review_data = {
        business_id,
        user_id,
        user_email,
        title: formData.title,
        review: formData.review,
        rating: formData.rating,
        status: 0,
      };
      const { data: r_data, error: r_error } = await supabase
        .from("reviews")
        .insert(review_data)
        .select()
        .single();
      if (r_error) throw r_error;

      if (images && r_data.id) {
        // upload review images
        const uploadReviewImages = await uploadImage(
          r_data.id,
          images,
          "reviews",
          `${r_data.id}/`
        );
        if (uploadReviewImages.error) throw uploadReviewImages.error;
        console.log(uploadReviewImages);
        let imagesUploadArr = uploadReviewImages
          .map((img) => img.url)
          .join(",");
        console.log(imagesUploadArr);

        // updating reviews table with images url
        const { data: updateImgsData, error: updateImgsError } = await supabase
          .from("reviews")
          .update({ review_files: imagesUploadArr })
          .eq("id", r_data.id)
          .select();
      }
      console.log("review added");

 
      const notification_data = {
        recevier_id:'admin',
        notification_type:'reviews',
        notification_operation:"add",
        related_entity_id:r_data.id
      }
      const { error:notification_error } = await supabase
      .from('notification')
      .insert(notification_data)
      if(notification_error) throw notification_error


      reset();
      setImages([])
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const imgDelete = (name) => {
    console.log(name)
    setImages(images.filter(file=>file.name != name))
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
          <div className="flex gap-4 items-center flex-wrap">
            {images.length > 0 && images.map((item, index) => (
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
                        imgDelete(typeof item == "string" ? item : item.name)
                      }
                    />
                  </div>
                )}
              </>
            ))}
          </div>
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
            Add
          </button>
          <button
            type="button"
            className="rounded-full my-5 uppercase shadow-btnShadow outline-none border border-primary text-primary text-center text-xs font-semibold py-4 w-full max-w-[200px] disabled:bg-gray-600 disabled:cursor-progress"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewsForm;
