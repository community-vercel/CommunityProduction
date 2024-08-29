"use client";
import CardService from "@/components/CardService";
import supabase from "@/lib/supabase";
import { HeartIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Favorite = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (!user.id) router.push("/");
    fetchResults();
  }, []);

  async function fetchResults() {
    const { data: haveData, error: haveError } = await supabase
      .from("favorite")
      .select("*,business(*)")
      .eq("user_id", user.id).eq("business.isArchived", false);

    if (haveError) {
      console.error("Error fetching results:", error);
    } else {
      console.log(haveData);
      setResults(haveData.filter(favorite=> favorite.business != null));
      setLoading(false);
    }
  }

  const favoritePageHide = (business_id) => {
    console.log(business_id)
    console.log(results.filter(business=>business.business_id != business_id))
    setResults(results.filter(business=>business.business_id != business_id))
  }
  return (
    <div className="p-7 pt-12 ">
      <h1 className="text-3xl font-bold flex gap-2">
        <span>Your Favorites</span>{" "}
        <div
          className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
        >
          <HeartIcon className={`w-7 h-7 text-red-500`} />
        </div>
      </h1>
      {loading ? (
        <div className="py-10">Loading</div>
      ) : results.length > 0 ? (
        <div className="flex flex-col-reverse md:flex-row gap-10 px-2 py-10 md:gap-4">
          <div className="md:w-full">
            <div className="flex gap-x-4 gap-y-5 flex-wrap">
              {results.map((item) => ( 
                    <CardService
                    business={item.business} 
                    user_id={user.id}
                    key={item.id}
                    favoritePageHide={favoritePageHide}
                  />  
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="m-5">No favorites found</div>
      )}
    </div>
  );
};

export default Favorite;
