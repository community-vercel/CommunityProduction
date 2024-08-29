"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import {
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import Message from "@/components/Message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterZod } from "@/zod/RegisterZod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setIsAuthenticated, setUserMeta, setSession, setUser } from "@/store/slices/authslice";
import supabase from "@/lib/supabase";

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(RegisterZod),
  });

  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);

  useEffect(() => {
    if (user.id && user_meta.role) { 
      if(user_meta.role == 'super_admin'){
        router.push("/dashboard/business");
      }else{
        router.push("/");
      }
    }
  }, [user_meta.role]);

  const onSubmit = async (formData) => {
    setMessage('')
    try {
      const { data, error:errorAuth } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullname,
          },
        },
      });
      if (errorAuth) throw errorAuth; 
      dispatch(setUser({ user: data.user }));
      dispatch(setSession({ session: data.session }));
      dispatch(setIsAuthenticated({ isAuthenticated: true }));

      
      const { data:usermetaData, error } = await supabase .from('user_meta').insert({ role: formData.role,user_id:data.user.id }).select().single()
      if(error) throw error
      let updatedUserMeta = {
        ...usermetaData,
        notification_count:await getNotificationCount(usermetaData.role,data.user.id)
      }
      dispatch(setUserMeta({ user_meta:updatedUserMeta }));
      
    } catch (error) {
      setMessage(error.message);
      console.error("Registration error", error);
    }
  };

  const getNotificationCount = async (usermeta,userID) => {
    let notificationsArray = [];
      if (usermeta === "super_admin") {
        const { data, error } = await supabase
          .from("notification")
          .select("*")
          .or(`recevier_id.eq.${userID},recevier_id.eq.admin`)
          .eq("read", false)
          .order("created_at", { ascending: false });
        if (error) throw error;
        notificationsArray = [...data];
      } else {
        const { data, error } = await supabase
          .from("notification")
          .select("*")
          .eq("recevier_id", userID)
          .eq("read", false)
          .order("created_at", { ascending: false });
        if (error) throw error;
        notificationsArray = [...data];
      }

      return notificationsArray.length
  }

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

      <div className="mb-5">
        <Formlabel text="Register as" />
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
        </div>

        {errors.role?.message && (
          <span className="text-red-400 text-sm pl-1">
            {errors.role?.message}
          </span>
        )}
      </div>

      <div className="">
        <Formlabel text="Password" forLabel="password" />
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
        Register
      </button>
      <div className="flex justify-between">
        <Link href="/login" className="text-primary text-xs font-semibold">
          Login
        </Link>
        <Link href="/forgetpassword" className="text-xs text-text-gray">
          Lost your password?
        </Link>
      </div>
    </form>
  );
}
