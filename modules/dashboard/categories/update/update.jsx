"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Message from "@/components/Message"; 
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCategoryZod } from "@/zod/AddCategoryZod";
import useAuth from "@/hooks/useAuth";
import uploadImage from "@/utils/uploadImage";
import Image from "next/image";
import { extractImagePath } from "@/utils/extractImagePath";
import { useSelector } from "react-redux";
import supabase from "@/lib/supabase";

const Update = () => {
  const router = useRouter();
  
  const {user,user_meta} = useSelector(state=>state.auth)

  const params = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailDB, setThumbnailDB] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverDB, setCoverDB] = useState(null);

  useEffect(() => {
    if (user && !user?.id) router.push("/");

    // function to fill the form data from data base
    const getData = async () => {
      try {
        // get all current buiness categories
        const { data, error } = await supabase
          .from("category")
          .select(`*`)
          .eq("id", params.id)
          .single();
        if (error) throw error;
        setValue("category", data.name);
        setThumbnailDB(data.thumbnail);
        setCoverDB(data.cover); 
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(AddCategoryZod),
  });

  const onSubmit = async (formData) => {
    setMessage("");
    try { 

      const { error: catError } = await supabase
        .from("category")
        .update({'name':formData.category})
        .eq("id", params.id);
      if (catError) throw catError;
 
      if(cover){
        const oldCoverUrl = extractImagePath(coverDB).replace("category/", "");

        const { data: oldCoverRemoveData, error: oldCoverRemoveError } =
          await supabase.storage.from("category").remove([oldCoverUrl]);
        if (oldCoverRemoveError) throw oldCoverRemoveError;
        console.log(oldCoverRemoveData)

        //  upload cover
        const uploadBusinessCover = await uploadImage(
          params.id,
          cover,
          "category",
          `category-images/`
        );
        if (uploadBusinessCover.error) throw uploadBusinessCover.error;

        const { data: updateLogoData, error: updateLogoError } = await supabase
          .from("category")
          .update({ cover: uploadBusinessCover[0].url })
          .eq("id", params.id)
          .select();
      }

      if(thumbnail){
        const oldThumbUrl = extractImagePath(thumbnailDB).replace("category/", "");

        const { data: oldThumbRemoveData, error: oldThumbRemoveError } =
          await supabase.storage.from("category").remove([oldThumbUrl]);
        if (oldThumbRemoveError) throw oldThumbRemoveError;
        console.log(oldThumbRemoveData)

        //  upload Thumb
        const uploadBusinessThumb = await uploadImage(
          params.id,
          thumbnail,
          "category",
          `category-images/`
        );
        if (uploadBusinessThumb.error) throw uploadBusinessThumb.error;

        const { data: updateThumbData, error: updateThumbError } = await supabase
          .from("category")
          .update({ thumbnail: uploadBusinessThumb[0].url })
          .eq("id", params.id)
          .select();
      }
 
      setMessage("Updated Successfully");
      router.push('/dashboard/categories')
    } catch (error) {
      if (error.message.includes("duplicate"))
        return setMessage("Category already exists!");
      setMessage(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      
      const { error } = await supabase
      .from('category')
      .update({ isArchived: true })
      .eq('id', params.id)
      if(error) throw error
      router.push('/dashboard/categories')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
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
              {thumbnailDB && (
                <div className="flex gap-4 items-center">
                  <span>Current Thumbnail:</span>
                  <Image
                    src={thumbnailDB}
                    alt=""
                    className="aspect-square my-4 rounded-sm  bg-white d-flex p-1"
                    width={180}
                    height={180}
                  />
                </div>
              )}
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
              {coverDB && (
                <div className="flex gap-4 items-center">
                  <span>Current Cover:</span>
                  <Image
                    src={coverDB}
                    alt=""
                    className="aspect-square my-4 rounded-sm  bg-white d-flex p-1"
                    width={180}
                    height={180}
                  />
                </div>
              )}
            </div>

            <div className=" flex justify-end gap-4">
              <button
                type="submit"
                className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
              >
                Update
              </button>
              {user_meta.role == "super_admin" && (
                <button
                  type="button"
                  className="max-w-[300px] rounded-full my-5 uppercase shadow-btnShadow outline-none bg-red-500 text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Update;
