"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import {
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/16/solid";
import Message from "@/components/Message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileZod } from "@/zod/ProfileZod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/store/slices/authslice";
import supabase from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(ProfileZod),
  });

  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);

  useEffect(() => {
    if (!user.id) {
      console.log(user, user_meta.role);
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    setValue("email", user.email);
    setValue("fullname", user.user_metadata.full_name);

    setValue("phone", user_meta?.phone);
    setValue("address", user_meta?.address);
  }, []);

  const onSubmit = async (formData) => {
    setMessage("");
    try {
      let userUpdateData = {};
      if (formData.password) {
        userUpdateData.password = formData.password;
      }
      if (formData.fullname !== user.user_metadata.full_name) {
        if (!userUpdateData.data) {
          userUpdateData.data = {};
        }
        userUpdateData.data.full_name = formData.fullname;
      }

      if (Object.keys(userUpdateData).length) {
        const { data, error } = await supabase.auth.updateUser(userUpdateData);
        if (error) throw error;
        dispatch(setUser({ user: data.user }));
        setMessage("Profile Updated");
      }

      if (formData.phone || formData.address) {
        console.log(formData.phone, formData.address);
        let user_metadata = {
          phone: formData.phone,
          address: formData.address,
        };

        const { error } = await supabase
          .from("user_meta")
          .update(user_metadata)
          .eq("user_id", user.id);

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
      console.error("Profile error", error);
    }
  };

  return (
    <div className="p-7 bg-white">
      <h1 className="text-2xl font-bold mb-8">Profile</h1>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        {message && <Message message={message} />}
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

        <div className="">
          <Formlabel text="New Password" forLabel="password" />
          <InputField
            inputId="password"
            inputName="password"
            inputType="password"
            register={register}
            error={errors.password}
          >
            <LockClosedIcon />
          </InputField>
        </div>

        <div className="">
          <Formlabel text="Confirm Password" forLabel="c_password" />
          <InputField
            inputId="c_password"
            inputName="confirmPassword"
            inputType="password"
            register={register}
            error={errors.confirmPassword}
          >
            <LockClosedIcon />
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
  );
}
