"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { LockClosedIcon } from "@heroicons/react/16/solid";
import Message from "@/components/Message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordZod } from "@/zod/UpdatePasswordZod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setIsAuthenticated, setSession, setUser, setUserMeta } from "@/store/slices/authslice";
import supabase from "@/lib/supabase";

export default function UpdatePassword() {
    const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(UpdatePasswordZod),
  });

  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    if (user.id) {
      router.push("/");
    }
  }, []);

  const onSubmit = async (formData) => { 
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: formData.password,
      });
      if (error) throw error;
      console.log("Update Password successful", data);
      dispatch(setUser({ user: data.user }));
      dispatch(setSession({ session: data.session }));

      const { data: usermetaData, error:errorUserMeta } = await supabase
        .from("user_meta")
        .select("*")
        .eq("user_id", data.user.id)
        .single();
      if (usermetaData && usermetaData.id) {
        let updatedUserMeta = {
          ...usermetaData,
          notification_count:await getNotificationCount(usermetaData.role,data.user.id)
        }
        dispatch(setUserMeta({ user_meta:updatedUserMeta }));
        dispatch(setIsAuthenticated({ isAuthenticated: true }));
        router.push("/");
      }


    } catch (error) {
      setMessage(error.message);
      console.error("Update Password error", error);
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
        Update Password
      </button>
    </form>
  );
}
