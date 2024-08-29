"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Loader from "@/components/Loader";
import supabase from "@/lib/supabase";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { UserZod } from "@/zod/UserZod";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const Id = () => {
  const params = useParams();
  const { user, user_meta } = useSelector((state) => state.auth);
  const [pre_approved, setpre_approved] = useState(false);
  const [loading, setloading] = useState(true);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(UserZod),
  });

  useEffect(() => {
    if (!user.id || user_meta.role != "super_admin") {
      router.push("/");
    }
  }, [user]);
  useEffect(() => {
    if (!user.id || user_meta.role != "super_admin") {
      router.push("/");
    }
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(
        params.id
      );
      if (error) throw error;

      setValue("email", data.user.email);
      setValue("fullname", data.user.user_metadata.full_name);

      const { data: usermeta, error: usermeta_error } = await supabase
        .from("user_meta")
        .select()
        .eq("user_id", params.id)
        .single();

      if (usermeta_error) throw usermeta_error;
      setValue("phone", usermeta?.phone);
      setValue("address", usermeta?.address);
      setValue("role", usermeta?.role);
      setValue("pre_approved", usermeta?.pre_approved);
      setpre_approved(usermeta?.pre_approved);

      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      let userAuthUpdateData = {
        email: formData.email,
        user_metadata: {
          full_name: formData.fullname,
        },
      };

      const { data: user_authupdate, error } =
        await supabaseAdmin.auth.admin.updateUserById(
          params.id,
          userAuthUpdateData
        );
      if (error) throw error;
      console.log(user_authupdate);

      const { data: user_meta_update, error: user_meta_update_error } =
        await supabase
          .from("user_meta")
          .update({
            phone: formData.phone,
            address: formData.address,
            pre_approved: formData.pre_approved,
            role: formData.role,
          })
          .eq("user_id", params.id)
          .select();

      if (user_meta_update_error) throw user_meta_update_error;
      console.log(user_meta_update);
      router.push('/dashboard/users')
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-7 bg-white">
          <h1 className="text-2xl font-bold mb-8">User Detail</h1>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <Formlabel text="Email" forLabel="email" />
              <InputField
                inputId="email"
                inputName="email"
                inputType="email"
                register={register}
                error={errors.email}
                disabled
              >
                <EnvelopeIcon />
              </InputField>
            </div>

            <div className="">
              <Formlabel text="Full Name" forLabel="fullname" />
              <InputField
                inputId="fullname"
                inputName="fullname"
                inputType="text"
                register={register}
                error={errors.fullname}
              >
                <UserIcon />
              </InputField>
            </div>

            <div className="">
              <Formlabel text="Phone No." forLabel="phone" />
              <InputField
                inputId="phone"
                inputName="phone"
                inputType="text"
                register={register}
                error={errors.phone}
              >
                <PhoneIcon />
              </InputField>
            </div>

            <div className="mb-5">
              <Formlabel text="Registered as:" />
              <div className="flex gap-4">
                <div className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="user"
                    id="user"
                    defaultChecked={true}
                    {...register("role")}
                  />
                  <label htmlFor="user">User</label>
                </div>
                <div className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="business"
                    id="business"
                    {...register("role")}
                  />
                  <label htmlFor="business">Business</label>
                </div>
                <div className="flex gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="moderator"
                    id="moderator"
                    {...register("role")}
                  />
                  <label htmlFor="moderator">Moderator</label>
                </div>
              </div>
            </div>

            <div className="mt-8 mb-5 flex gap-2 items-center">
              <Formlabel text="Pre-approved:" />
              <input
                type="checkbox"
                {...register("pre_approved")}
                defaultChecked={pre_approved}
                className="mb-3"
              />
            </div>

            <div className="">
              <Formlabel text="Address" forLabel="address" />
              <InputField
                inputId="address"
                inputName="address"
                inputType="text"
                register={register}
                error={errors.address}
              >
                <MapPinIcon />
              </InputField>
            </div>

            <button
              type="submit"
              className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
            >
              Update
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Id;
