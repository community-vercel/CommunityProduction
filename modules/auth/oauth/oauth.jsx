"use client";
import React, { useEffect, useState } from "react";
import { setIsAuthenticated, setRole, setUser, setUserMeta } from "@/store/slices/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Formlabel from "@/components/Formlabel";
import supabase from "@/lib/supabase";

const OAuth = () => {
  const [checkIfRoleExits, setCheckIfRoleExits] = useState(true);
  const [checkboxRole, setCheckboxRole] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);
  const user_meta = useSelector((state) => state.auth.user_meta);

  if(user && user_meta.role) router.push('/')

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user:userData },
      } = await supabase.auth.getUser();
      dispatch(setUser({ user: userData }));
      console.log(userData)
      if (userData) {
        const { data: usermetaData, error } = await supabase
          .from("user_meta")
          .select("*")
          .eq("user_id", userData.id)
          .single();

          if (usermetaData && usermetaData.id) {
            

            let updatedUserMeta = {
              ...usermetaData,
              notification_count:await getNotificationCount(usermetaData.role,userData.id)
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
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
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
    <div>
      {!checkIfRoleExits && (
        <form onSubmit={handleSubmit}>
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

      {checkIfRoleExits && <div className="">Verifying...</div>}
    </div>
  );
};

export default OAuth;
