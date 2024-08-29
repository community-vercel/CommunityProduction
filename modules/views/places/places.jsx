"use client";
import React, { useEffect, useState } from "react";
import { automotive, beauty, dentist, finical, meeting, org } from "@/assets";
import CardCategory from "@/components/CardCategory";
import TopBanner from "@/components/TopBanner";
import supabase from "@/lib/supabase";

const Places = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  async function fetchCategoryCounts() {
    try {
      // Fetch all categories
      const { data: categories, error: categoriesError } = await supabase
        .from("category")
        .select("*").eq("isArchived", false);

      if (categoriesError) throw categoriesError;

      // Fetch counts for each category
      const { data: counts, error: countsError } = await supabase
        .from("category_business")
        .select("category_id, business!inner(approved)")
        .eq("business.approved", '1').eq('business.isArchived', false);

      console.log(counts);
      if (countsError) throw countsError;

      const combinedData = categories.map((category) => ({
        data: category,
        business_count: counts.filter((c) => c.category_id === category.id)
          .length,
      }));

      setCategories(combinedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <TopBanner
        img={meeting}
        label="Free Listing"
        heading="Business Category"
        btnTxt={
          <>
            + List your business <span className="font-bold">for free</span>
          </>
        }
      />

      {loading ? (
        <div className="">Loading</div>
      ) : categories.length ? (
        <div className=" px-7 py-16 flex gap-x-3 gap-y-5 flex-wrap">
          {categories.map((category) => (
            <CardCategory
              key={category.data.id}
              url={`/places/category/${category.data.id}`}
              img={
                category.data.thumbnail ? category.data.thumbnail : automotive
              }
              title={category.data.name}
              des={`${category.business_count} listings`}
            />
          ))}
        </div>
      ) : (
        <div className="">No category exists</div>
      )}
    </div>
  );
};

export default Places;
