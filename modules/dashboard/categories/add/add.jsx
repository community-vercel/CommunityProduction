"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import useUser from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCategoryZod } from "@/zod/AddCategoryZod";
import useAuth from "@/hooks/useAuth";
import uploadImage from "@/utils/uploadImage";
import supabase from "@/lib/supabase";

const Add = () => {
  const router = useRouter();
  const auth = useAuth();
  const [message, setMessage] = useState(null);
  if (auth && !auth.user?.id) router.push("/");

  const [thumbnail, setThumbnail] = useState(null);
  const [cover, setCover] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(AddCategoryZod),
  });

  const onSubmit = async (formData) => {
    setMessage("");
    try {
      if (!thumbnail) return setMessage("Please select thumbnail");
      if (!cover) return setMessage("Please select cover");

      const { data: catData, error } = await supabase
        .from("category")
        .insert({ name: formData.category })
        .select()
        .single();
      if (error) throw error;

      const uploadResultThumb = await uploadImage(
        catData.id,
        thumbnail,
        "category",
        "category-images"
      );
      if(uploadResultThumb.error) throw error 
      console.log(uploadResultThumb);

      const uploadResultCover = await uploadImage(
        catData.id,
        cover,
        "category",
        "category-images"
      );
      if(uploadResultCover.error) throw error 
      console.log(uploadResultCover);
 
      
      const { data:updateImgsData, error:updateImgsError } = await supabase
      .from('category')
      .update({ thumbnail: uploadResultThumb[0].url, cover:uploadResultCover[0].url})
      .eq('id', catData.id)
      .select()

      if(updateImgsError) {
        throw new Error('Error while inserting images') 
        console.log(updateImgsError)
      }
      console.log(updateImgsData)
      setMessage("Added Successfully");
    } catch (error) {
      if (error.message.includes("duplicate"))
        return setMessage("Category already exists!");
      setMessage(error.message);
    }
  };

 

  return (
    <div className="p-7">
      {message && <Message message={message} />}
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="">
          <Formlabel text="Category" forLabel="category" />
          <InputField
            inputId="category"
            inputName="category"
            inputType="text"
            register={register}
            error={errors.category}
          ></InputField>
        </div>

        <div className="mb-5">
          <Formlabel text="Thumbnail" forLabel="thumbnail" />
          <input
            id="thumbnail"
            onChange={(e) => setThumbnail(Array.from(e.target.files))}
            className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
            type="file"
            name="thumbnail"
            accept="image/jpeg,image/png,image/webp"
          />
        </div>

        <div className="mb-5">
          <Formlabel text="Cover" forLabel="cover" />
          <input
            id="cover"
            onChange={(e) => setCover(Array.from(e.target.files))}
            className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
            type="file"
            name="cover"
            accept="image/jpeg,image/png,image/webp"
          />
        </div>

        <div className=" flex justify-end">
          <button
            type="submit"
            className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
