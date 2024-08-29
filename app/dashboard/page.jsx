"use client";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React from "react";


const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  if (!auth.user.id) router.push("/");
  return <div>Welcome</div>;
};

export default Page;
