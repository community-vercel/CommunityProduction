"use client";

import BusinessNotification from "@/components/BusinessNotification";
import Loader from "@/components/Loader";
import ReviewNotification from "@/components/ReviewNotification";
import supabase from "@/lib/supabase";
import { setUserMeta } from "@/store/slices/authslice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Notifications = () => {
  const { user, user_meta } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const router = useRouter();

  const [notificationsOld, setNotificationsOld] = useState([]);
  const [notificationsNew, setNotificationsNew] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id) router.push("/");
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try { 
      let notificationsArray = [];

      if (user_meta.role === "super_admin") {
        const { data, error } = await supabase
          .from("notification")
          .select("*")
          .or(`recevier_id.eq.${user.id},recevier_id.eq.admin`)
          .order("created_at", { ascending: false });
        if (error) throw error;
        notificationsArray = [...data];
      } else {
        const { data, error } = await supabase
          .from("notification")
          .select("*")
          .eq("recevier_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        notificationsArray = [...data];
      }

      const detailedNotifications = await Promise.all(
        notificationsArray.map(getNotificationDetails)
      );
 
      console.log(detailedNotifications)
      setNotificationsOld(detailedNotifications.filter(notification => notification.read));
      setNotificationsNew(detailedNotifications.filter(notification => !notification.read));
      setLoading(false);

      let markRead = notificationsArray.map(notification=> {
        return {id:notification.id,read:true}
      })
 
      
      const { data, error } = await supabase
      .from('notification')
      .upsert(markRead)
      .select()
      if(error) throw error

      dispatch(setUserMeta({ user_meta:{...user_meta,notification_count:0} }));


    } catch (error) {
      console.log(error);
    }
  };

  async function getNotificationDetails(notification) {
    if (notification.notification_type === "business") {
      const { data, error } = await supabase
        .from("business")
        .select("name")
        .eq("id", notification.related_entity_id)
        .single();
      if (error) throw error;
      if (data) notification.business = data;
    } else if (notification.notification_type === "reviews") {
      const { data, error } = await supabase
        .from("reviews")
        .select("id,business(id,name)")
        .eq("id", notification.related_entity_id)
        .single();
      if (error) throw error;
      if (data) notification.review = data;
    }

    return notification;
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) :  (
        <div className="m-5 p-5"> 
            {notificationsNew.length > 0 && (
              <>
              <div className="relative text-center h-10 mb-3">
                <hr className="absolute top-[13px] w-full z-1"/>
                <span className="bg-[#F1F3F6] px-3 py-3 relative z-10 font-bold text-primary">NEW</span>
              </div>
              {notificationsNew.map((notification,index) => {
                return (
                  <div key={`business_reviews${index}`}>
                    {notification.notification_type == "reviews" ? (
                      <ReviewNotification notification={notification} key={notification.id}/>
                    ) : (
                      <BusinessNotification notification={notification} key={notification.id}/>
                    )}
                  </div>
                );
              })}
              </>
            )}

            {notificationsOld.length > 0 && (
              <>
              <div className="relative text-center h-10 mb-3 mt-8">
                <hr className="absolute top-[13px] w-full z-1"/>
                <span className="bg-[#F1F3F6] px-3 py-3 relative z-10 font-bold">OLD</span>
              </div>
              {notificationsOld.map((notification,index) => {
                return (
                  <div key={`business_reviews${index}`}>
                    {notification.notification_type == "reviews" ?  <ReviewNotification notification={notification} key={notification.id}/>
                     :  <BusinessNotification notification={notification} key={notification.id}/>
                    }
                  </div>
                );
              })}
              </>
            )} 
          
        </div>
      )}
    </div>
  );
};

export default Notifications;
