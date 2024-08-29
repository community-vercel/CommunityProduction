"use client";
import React, { useEffect, useState } from "react";

import {
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
  BellIcon,
  UserIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/16/solid";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAuthenticated,
  setSession,
  setUser,
  setUserMeta,
} from "@/store/slices/authslice";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase";

const Header = () => {
  const {user,user_meta} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q");

  const logout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // console.log("logout successful");
      dispatch(setUser({ user: {} }));
      dispatch(setSession({ session: {} }));
      dispatch(setIsAuthenticated({ isAuthenticated: false }));
      dispatch(setUserMeta({ user_meta: "" }));
    } catch (error) {
      console.log("logout error");
    }

  }
 
  useEffect(() => {
    // if(!q) router.push(`/search`)


    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) { 
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);  
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
 
  


  return (
    <header className="h-24 [@media(max-width:370px)]:pl-10 pl-12 sm:pl-16 lg:pl-0 flex justify-between bg-white relative z-20">
      <form className="flex gap-2 items-center">
        <button type="submit" className="cursor-pointer"><MagnifyingGlassIcon className="h-6 w-6 text-[#571021]" /></button>
        <input
          type="text"
          name="search"
          placeholder="Start typing to search..."
          className="[@media(max-width:370px)]:max-w-[145px] text-sm outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <div className="flex gap-4 lg:gap-10 items-center py-1 px-2 sm:px-8">
        <LanguageSelector />
        <ul
          className="hidden md:flex gap-5 items-center relative mx-4 before:absolute before:left-[-30px] before:h-5 before:w-[1px] before:bg-gray-200
        after:absolute after:right-[-30px] after:h-5 after:w-[1px] after:bg-gray-200
        "
        >
          <li>
            <Link href={` ${user.id ? "/dashboard/profile/" : "/login"} `}>
              <UserIcon className="h-6 w-6" />
            </Link>
          </li>
          <li>
            <Link href={` ${user.id ? "/dashboard/notifications/" : "/login"} `} className="relative">
              <BellIcon className="h-6 w-6" />
              {(user.id && user_meta.notification_count > 0) && (
                <span className="absolute text-xs bg-red-700 text-white flex items-center justify-center -top-1 -right-2 w-4 h-4 rounded-full">
                  {user_meta.notification_count}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link href="#">
              <ChatBubbleBottomCenterIcon className="h-6 w-6" />
            </Link>
          </li>
        </ul>

        {user && user?.id && (
          <button
            className="hidden md:flex gap-1 items-center min-w-fit"
            onClick={(e) => logout(e)}
          >
            <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
            <span className="text-sm text-text-color">Logout</span>
            {user.user_metadata.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                className="ml-2 w-8 h-8 rounded-full"
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <span
                className="flex ml-2 w-8 h-8 rounded-full uppercase text-white bg-black text-center items-center justify-center font-bold"
                title={user.email}
              >
                {user.user_metadata.full_name.split("")[0]}
              </span>
            )}
          </button>
        )}

        {!user?.id && (
          <Link
            href="/login"
            className="hidden md:flex gap-1 items-center min-w-fit"
          >
            <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
            <span className="text-sm text-text-color">Login or Register</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
