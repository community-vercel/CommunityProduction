"use client";
import { dummy } from "@/assets";
import {
  ArrowUpCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  PhoneIcon,
  ReceiptPercentIcon,
  StarIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import supabase from "@/lib/supabase";

const CardService = ({ business, user_id = null, favoritePageHide = null }) => {
  const [stats, setStats] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function getStats() {
      try {
        if (business.id) {
          const { data: statsData, error: statsError } = await supabase.rpc(
            "get_rating_stats",
            { business_id_param: business.id }
          );

          if (statsError) throw statsError;
          setStats(statsData);

          if (user_id && !favoritePageHide) {
            const { data: haveData, error: haveError } = await supabase
              .from("favorite")
              .select("*")
              .eq("user_id", user_id)
              .eq("business_id", business.id)
              .single();

            if (haveData && haveData.id) {
              setIsFavorite(!isFavorite);
            }
          }else if(favoritePageHide){
            setIsFavorite(!isFavorite);
          }
        }
      } catch (error) {}
    }

    getStats();
  }, [business]);

  const toggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      if (favoritePageHide) {
        favoritePageHide(business.id);
        const { data: delData, error: delError } = await supabase
          .from("favorite")
          .delete()
          .eq("business_id", business.id)
          .eq("user_id", user_id)
          .select();
        if (delError) throw error;
      } else {
        const { data: haveData, error: haveError } = await supabase
          .from("favorite")
          .select("*")
          .eq("user_id", user_id)
          .eq("business_id", business.id)
          .single();

        if (haveData && haveData.id) {
          const { data: delData, error: delError } = await supabase
            .from("favorite")
            .delete()
            .eq("id", haveData.id)
            .select();
          if (delError) throw error;
        } else {
          const { data, error } = await supabase
            .from("favorite")
            .insert({ user_id, business_id: business.id })
            .select();
          if (error) throw error;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-[170px] lg:w-[24%] lg:flex-[24%] p-8 bg-white rounded-3xl border-[1px] border-transparent hover:border-secondary">
      {business.isFeatured && (
        <div className="flex gap-1 items-center mb-2 text-green-400"> 
        <ArrowUpCircleIcon className="w-5 h-7" />
          <span>Featured</span>
        </div>
      )}
      {business.discount_code && <div className="flex gap-1 items-center mb-2 text-green-400">
        <ReceiptPercentIcon className="w-5 h-7" />
          <span>Offering Discounts</span>
        </div>}
      <Link
        href={`/places/category/business/${business.id}`}
        className="flex justify-between items-start gap-4"
      >
        <div className="">
          <h2 className="text-base text-text-color mb-1 font-semibold">
            {business.name}
          </h2>
          <p className="text-sm text-[#050505] mb-5 break-all">
            {business.description.slice(0, 90)}....
          </p>
        </div>
        <div className=" ">
          <Image
            src={business.logo ? business.logo : dummy}
            className="w-[70px] min-w-[70px] h-[70px] object-cover rounded-full"
            alt=""
            width={100}
            height={100}
          />
        </div>
      </Link>
      <ul className="mt-2 mb-7">
        {business.phone && (
          <li>
            <Link
              href={`tel:${business.phone}`}
              className="flex gap-3 text-[#050505] text-[15px] mb-2"
            >
              <PhoneIcon className="w-6 h-6 text-text-gray" />
              <span>{business.phone}</span>
            </Link>
          </li>
        )}

        {business.website && (
          <li>
            <Link
              href={`${business.website}`}
              className="flex gap-3 text-[#050505] text-[15px] mb-2"
            >
              <GlobeAltIcon className="w-6 h-6 text-text-gray" />
              <span>Website</span>
            </Link>
          </li>
        )}

        {business.email && (
          <li>
            <Link
              href={`mailto:${business.email}`}
              className="flex gap-3 text-[#050505] text-[15px] mb-2"
            >
              <EnvelopeIcon className="w-6 h-6 text-text-gray" />
              <span>Email</span>
            </Link>
          </li>
        )}
      </ul>

      <div className="flex justify-between">
        <StarRating rating={stats.length ? stats[0].avg_rating : 0} />
        {user_id ? (
          <button
            className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
            onClick={toggleFavorite}
          >
            <HeartIcon className={`w-7 h-7 ${isFavorite && "text-red-500"}`} />
          </button>
        ) : (
          <Link
            href="/login"
            className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}
          >
            <HeartIcon className={`w-7 h-7`} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default CardService;
