"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgetPasswordZod } from "@/zod/ForgetPasswordZod";
import { useState } from "react";
import supabase from "@/lib/supabase";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(ForgetPasswordZod),
  });
  const [message, setMessage] = useState(
    "Please enter your username or email address. You will receive an email message with instructions on how to reset your password. "
  );
 
  const onSubmit = async (formData) => {
    console.log(formData,`${process.env.NEXT_PUBLIC_SITE_URL}update-password`);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}update-password`,
        }
      );
      if (error) throw error;
      setMessage('Please check your email');
      console.log("Forget Password successful", data);
    } catch (error) {
      setMessage(error.message);
      console.error("Forget Password error", error);
    }
  };

  return (
    <form className="max-w-lg mx-auto w-full" onSubmit={handleSubmit(onSubmit)}>
      {message && <Message message={message} />}
      <div className="">
        <Formlabel text="Email" forLabel="email" />
        <InputField
          inputId="email"
          inputName="email"
          inputType="email"
          register={register}
          error={errors.email}
        >
          <EnvelopeIcon />
        </InputField>
      </div>

      <button className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full">
        GET NEW PASSWORD
      </button>
      <div className="flex justify-between">
        <Link href="/login" className="text-primary text-xs font-semibold">
          Login
        </Link>
        <Link href="/register" className="text-primary text-xs font-semibold">
          Register
        </Link>
      </div>
    </form>
  );
};

export default ForgotPassword;
