"use client";
import CardService from "@/components/CardService";
import Checkbox from "@/components/Checkbox";
import supabase from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { useSelector } from "react-redux";

const Search = () => {
  const params = useSearchParams();
  const q = params.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [error, setError] = useState(null);
  const [discount, setDiscount] = useState(false);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("category")
          .select("id, name").eq("isArchived", false);

        if (error) {
          console.error("Error fetching categories:", error);
          setError(error);
        } else {
          setCategories(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching categories:", err);
        setError(err);
      }
    }
    async function fetchTags() {
      try {
        const { data, error } = await supabase
          .from("tag_business")
          .select("tag");

        if (error) {
          console.error("Error fetching tags:", error);
          setError(error);
        } else {
          let allTags = [];
          data.forEach((tag) =>
            tag.tag.split(",").length > 1
              ? tag.tag.split(",").forEach((iTag) => {
                allTags.push(iTag) 
              })
              : allTags.push(tag.tag)
          ); 
          setTags([...new Set(allTags)].sort());
        }
      } catch (err) {
        console.error("Unexpected error fetching tags:", err);
        setError(err);
      }
    }
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    setResults([]);
    setLoading(true);
    setError(null);
    fetchResults(q, selectedCategory, selectedRating, selectedTag);
  }, [q, selectedCategory, selectedRating, selectedTag,discount]);

  async function fetchResults(
    query,
    selectedCategory,
    selectedRating,
    selectedTag
  ) {
    console.log(
      "Fetching results with query:",
      query,
      "and category:",
      selectedCategory,
      "and rating:",
      selectedRating,
      "and tag:",
      selectedTag,
      "and discount:",
      discount
    );

    try {
      let queryBuilder = supabase
        .from("business")
        .select("*")
        .eq("approved", "1")
        .eq("isArchived", false);


      if(discount){
        queryBuilder = queryBuilder.not('discount_code', 'is', null).neq("discount_code", "");
      }

      if (selectedCategory) {
        const { data: categoryBusiness, error: categoryError } = await supabase
          .from("category_business")
          .select("business_id")
          .eq("category_id", selectedCategory);

        if (categoryError) {
          console.error(
            "Error fetching category_business data:",
            categoryError
          );
          setError(categoryError);
          return;
        }

        const businessIds = categoryBusiness.map((cb) => cb.business_id);

        if (businessIds.length > 0) {
          queryBuilder = queryBuilder.in("id", businessIds);
        } else {
          setResults([]);
          setLoading(false);
          return;
        }
      }

      if (selectedRating) { 

          const { data: reviewData, error: reviewError } = await supabase
          .rpc('get_businesses_by_rating', { min_rating: selectedRating });   

        if (reviewError) {
          console.error("Error fetching reviews data:", reviewError); 
          setError(reviewError);
          return;
        }

        const businessIdsWithRating = reviewData.map(
          (review) => review.business_id
        );

        if (businessIdsWithRating.length > 0) {
          queryBuilder = queryBuilder.in("id", businessIdsWithRating);
        } else {
          setResults([]);
          setLoading(false);
          return;
        }
      }

      if (selectedTag) {
        const { data: tagBusiness, error: tagError } = await supabase
          .from("tag_business")
          .select("business_id")
          .ilike('tag', `%${selectedTag}%`)

        if (tagError) {
          console.error("Error fetching tag_business data:", tagError);
          setError(tagError);
          return;
        }

        const businessIdsWithTag = tagBusiness.map((tb) => tb.business_id);

        if (businessIdsWithTag.length > 0) {
          queryBuilder = queryBuilder.in("id", businessIdsWithTag);
        } else {
          setResults([]);
          setLoading(false);
          return;
        }
      }

      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%, description.ilike.%${query}%, location.ilike.%${query}%, phone.ilike.%${query}%`
        );
      }

      const { data, error } = await queryBuilder.order('isFeatured', { ascending: false });

      if (error) {
        console.error("Error fetching results:", error);
        setError(error);
      } else {
        console.log("Fetched results:", data);
        setResults(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching results:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const hanndleDiscountChange = () => {
    setDiscount(!discount)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-7 pt-14 space-y-3">
        <h1 className="text-3xl font-bold">Search</h1>
        <div className="flex items-center gap-3">
          <div className="mb-4"> 
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4"> 
            <select
              id="rating"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4"> 
            <select
              id="tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Tags</option>
              {tags.map((tag,index) => (
                <option key={`tag${index}`} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
              <Checkbox checkboxId='discount' checkboxLable='Have Disounts?' chkd={discount} handleChange={hanndleDiscountChange}/>
          </div>
        </div>
        {loading ? (
          <div className="py-10">Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : results.length > 0 ? (
          <div className="flex flex-col-reverse md:flex-row gap-10 px-2 py-10 md:gap-4">
            <div className="md:w-full">
              <div className="flex gap-x-4 gap-y-5 flex-wrap">
                {results.map((item) => (
                  <CardService
                    business={item}
                    key={item.id}
                    user_id={user.id}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="m-5">No results found</div>
        )}
      </div>
    </Suspense>
  );
};

export default Search;
