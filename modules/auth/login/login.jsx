"use client";

import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { UserIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import Message from "@/components/Message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginZod } from "@/zod/LoginZod";

import { useEffect, useState } from "react";

import {
  setUser,
  setSession,
  setIsAuthenticated,
  setUserMeta,
} from "@/store/slices/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { google } from "@/assets";
import supabase from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginZod),
  });

  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);

  const [checkIfRoleExits, setCheckIfRoleExits] = useState(true);
  const [checkboxRole, setCheckboxRole] = useState('user');

  useEffect(() => {
    if (user && user.id && user_meta.role) {
      router.push("/");
    }
  }, []);

  const onSubmit = async (formData) => {
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: formData.email,
          password: formData.password,
        }
      );
      if (authError) throw authError;
      dispatch(setUser({ user: data.user }));
      dispatch(setSession({ session: data.session }));
      dispatch(setIsAuthenticated({ isAuthenticated: true }));
      console.log("login successful");

      const { data: usermetaData, error } = await supabase
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
        if(usermetaData.role == 'super_admin'){
          router.push("/dashboard/business");
        }else{
          router.push("/");
        }
      } else {
        setCheckIfRoleExits(false);
      }
      console.log(usermetaData, error);
    } catch (error) {
      setMessage(error.message);
      console.error("login error", error);
    }
  };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    console.log(process.env.NEXT_PUBLIC_SITE_URL + "oauth");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "oauth",
        },
      });
      if (error) throw error;
      console.log("ologin clicked ",data);
    } catch (error) {
      setMessage(error.message);
      console.error("ologin error", error);
    }
  };

  const handleSubmitRole = async (e) => {
    e.preventDefault();
    console.log(checkboxRole);
    const { data,error } = await supabase
      .from("user_meta")
      .insert({ role: checkboxRole, user_id: user.id }).select().single();
    if (error) throw error;

    let updatedUserMeta = {
      ...data,
      notification_count:await getNotificationCount(data.role,user.id)
    }
    dispatch(setUserMeta({ user_meta:updatedUserMeta }));
 

    dispatch(setIsAuthenticated({ isAuthenticated: true }));
    console.log("role added");
    if(data.role == 'super_admin'){
      router.push("/dashboard/business");
    }else{
      router.push("/");
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
    <>
      {!checkIfRoleExits && (
        <form onSubmit={handleSubmitRole}>
          <h3 className="text-2xl">Please complete your profile</h3>
          <div className="my-5">
            <Formlabel text="Register as" />
            <div className="flex gap-4">
              <div className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  id="user"
                  name="role"
                  defaultChecked={true}
                  onChange={() => setCheckboxRole("user")}
                />
                <label htmlFor="user">User</label>
              </div>
              <div className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="business"
                  id="business"
                  onChange={() => setCheckboxRole("business")}
                />
                <label htmlFor="business">Business</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Confirm
          </button>
        </form>
      )}

      {checkIfRoleExits && (
        <form
          className="max-w-lg mx-auto w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              <UserIcon />
            </InputField>
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

          <button
            type="submit"
            className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full"
          >
            Log In
          </button>
          <div className="flex justify-between mb-5">
            <Link
              href="/register"
              className="text-primary text-xs font-semibold"
            >
              Register
            </Link>
            <Link href="/forgetpassword" className="text-xs text-text-gray">
              Lost your password?
            </Link>
          </div>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex gap-2 p-3 text-center justify-center rounded-lg mb-4 border border-text-gray w-full"
          >
            <Image src={google} alt="" className="w-5 h5" /> <span>Google</span>
          </button>
        </form>
      )}
    </>
  );
}
