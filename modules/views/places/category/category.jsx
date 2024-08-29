"use client";
import React, { useEffect, useState } from "react";
import { BB } from "@/assets";
import TopBanner from "@/components/TopBanner";
import CardService from "@/components/CardService";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Checkbox from "@/components/Checkbox";

import { CitySelect, StateSelect,GetLanguages } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import supabase from "@/lib/supabase";

const Category = () => {
  const [category, setCategory] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { user } = useSelector((state) => state.auth);

  // for state and city,language library
  const countryid = 233;
  const [stateid, setstateid] = useState(0);
  const [languageList, setLanguageList] = useState([]);
  // for search
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedLangauge, setSelectedLangauge] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [discount, setDiscount] = useState(false);

  // for infinite scroll
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCategoryAndBusinesses();
      GetLanguages().then((result) => {
        setLanguageList(result);
      });
    }
  }, [params.id]);

  async function fetchCategoryAndBusinesses() { 
    try {
      setLoading(true); 
      
      const { from, to } = getFromTo();
      // Fetch businesses for this category
      const { data: businessesData, error: businessesError } = await supabase
        .from("category_business")
        .select(
          ` category(*),
          business(*)
        `
        )
        .eq("category_id", params.id)
        .eq("business.approved", "1").eq("business.isArchived", false)
        .range(from, to); 

      if (businessesError) throw businessesError;
      setCategory(businessesData[0].category);
      setBusinesses(businessesData.filter((item) => item.business != null));
      setPage(page + 1);
      
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMoreBusiness() {
    try {
       console.log('runn...')
      const { from, to } = getFromTo();
      // Fetch businesses for this category
      const { data: businessesData, error: businessesError } = await supabase
        .from("category_business")
        .select(
          `  
          business(*)
        `
        )
        .eq("category_id", params.id)
        .eq("business.approved", "1")
        .eq("business.isArchived", false)
        .order('id', { ascending: true })
        .range(from, to);

      if (businessesError) throw businessesError;
      setBusinesses([
        ...businesses,
        ...businessesData.filter((item) => item.business != null),
      ]);
      
      
      setPage((page) => page + 1); 
      // businessesData &&
      // [...businessesData.filter((item) => item.business != null)] > 0
      //   ? setHasMore(true)
      //   : setHasMore(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  const getFromTo = () => {
    const item_per_page = 2;
    let from = page * item_per_page;
    let to = from + item_per_page;
    if (page > 0) from += 1;
    return { from, to };
  };

  const hanndleDiscountChange = () => {
    setDiscount(!discount);
  };

  // search form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      `Search for state:${selectedState}, city:${selectedCity},rating: ${selectedRating}, discount: ${discount}`
    );

    // const { from, to } = getFromTo();
    // setPage(page + 1);

    let queryBuilder = supabase
      .from("category_business")
      .select("business(*)")
      .eq("category_id", params.id)
      .eq("business.approved", "1");

    if (discount) {
      queryBuilder = queryBuilder
        .not("business.discount_code", "is", null)
        .neq("business.discount_code", "");
    }

    if(selectedLangauge){
      queryBuilder = queryBuilder.eq("business.language", selectedLangauge);
    }

    if (selectedState) {
      queryBuilder = queryBuilder.eq("business.state", selectedState);
    }

    if (selectedCity) {
      queryBuilder = queryBuilder.eq("business.city", selectedCity);
    }

    if (selectedRating) {
      const { data: reviewData, error: reviewError } = await supabase.rpc(
        "get_businesses_by_rating",
        { min_rating: selectedRating }
      );

      if (reviewError) {
        console.error("Error fetching reviews data:", reviewError);
        return;
      }

      const businessIdsWithRating = reviewData.map(
        (review) => review.business_id
      );

      if (businessIdsWithRating.length > 0) {
        queryBuilder = queryBuilder.in("business.id", businessIdsWithRating);
      } else {
        return;
      }
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error fetching results:", error);
    } else {
      console.log("Fetched results:", data);
      setBusinesses(data.filter((item) => item.business != null));
    }
  };

  // reset form 
  async function resetForm() { 
    try { 
      console.log(page)
      setBusinesses([])
      setSelectedCity('')
      setSelectedState('')
      setSelectedRating('')
      setSelectedLangauge('')
      setDiscount(false)
      setstateid('')
      setPage(1)
       
      // Fetch businesses for this category
      const { data: businessesData, error: businessesError } = await supabase
        .from("category_business")
        .select(`business(*)`)
        .eq("category_id", params.id)
        .eq("business.approved", "1").eq("business.isArchived", false)
        .range(0, 2);
 

      if (businessesError) throw businessesError;
      setBusinesses(businessesData.filter((item) => item.business != null));
      setHasMore(true) 
    } catch (error) {
      console.log(error);
    } 
  }

  return (
    <>
      {loading ? (
        <div className="">Loading</div>
      ) : (
        <div>
          <TopBanner
            invert
            back
            img={category.cover ? category.cover : BB}
            label="Free Listing"
            heading={`${category.name}`}
            btnTxt={
              <>
                + List your business <span className="font-bold">for free</span>
              </>
            }
          />


          <div className="flex flex-col-reverse md:flex-row gap-10 px-7 py-16 md:gap-4">
            {businesses.length > 0 ? (
              <div className="md:w-[75%]">
                <InfiniteScroll
                  dataLength={page * 10} 
                  next={fetchMoreBusiness}
                  hasMore={hasMore}
                  loader={<div>  </div>} 
                >
                  <div className="flex gap-x-4 gap-y-5 flex-wrap">
                    {businesses.map((item) => (
                      <CardService
                        business={item.business}
                        key={item.business.id}
                        user_id={user.id}
                      />
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            ) : (
              <div className="md:w-[75%] m-5">No business.</div>
            )}
            <div className="md:w-[25%] sticky">
              <form
                className="p-8 bg-white rounded-3xl"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="states" className="text-base font-semibold  ">
                    State
                  </label>
                  <StateSelect
                    countryid={countryid}
                    onTextChange = {(e)=>{
                      if(!e.target.value){
                        setstateid('');
                        setSelectedState('');
                      }
                    }}
                    onChange={(e) => {
                      console.log(e);
                      setstateid(e.id);
                      setSelectedState(e.name);
                    }}
                    placeHolder="Select State"
                    inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                  />
                </div>

                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="states" className="text-base font-semibold">
                    City
                  </label>
                  <CitySelect
                    countryid={countryid}
                    stateid={stateid}
                    onTextChange = {(e)=>{
                      if(!e.target.value){ 
                        setSelectedCity('');
                      }
                    }}
                    onChange={(e) => {
                      console.log(e);
                      setSelectedCity(e.name);
                    }}
                    placeHolder="Select City"
                    inputClassName="outline-none shadow-formFeilds text-sm font-inter !border-transparent w-full"
                  />
                </div>

                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="city" className="text-base font-semibold">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="outline-none shadow-formFeilds text-sm py-3 rounded-md px-2 border-[1px] border-[#ccc] w-full"
                  >
                    <option value="">All Ratings</option>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3 mb-7">
                  <label htmlFor="Langauge" className="text-base font-semibold">
                  Langauge
                  </label>
                  <select
                    id="language"
                    value={selectedLangauge}
                    onChange={(e) => setSelectedLangauge(e.target.value)}
                    className="outline-none shadow-formFeilds text-sm py-3 rounded-md px-2 border-[1px] border-[#ccc] w-full"
                  >
                    <option value="">All Langauges</option>
                    {languageList.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-7">
                  <Checkbox
                    checkboxId="discount"
                    checkboxLable="Have Disounts?"
                    chkd={discount}
                    handleChange={hanndleDiscountChange}
                  />
                </div>

                {/* <div className="flex flex-col gap-3 mb-7">
                    <label
                      htmlFor="community"
                      className="text-base font-semibold"
                    >
                      Community
                    </label>
                    <select
                      id="community"
                      name="community"
                      className="rounded-full outline-none shadow-formFeilds text-sm py-4 px-5 border-2 border-[#E4E4E4] w-full"
                    >
                      <option value="">Select community</option>
                      <option value="arabs-in-usa">Arabic Communities</option>
                      <option value="egyptian-in-boston">
                        Egyptians in USA
                      </option>
                      <option value="jordans-in-california">
                        Jordanians in USA
                      </option>
                      <option value="moroccans-in-california">
                        Moroccans in USA
                      </option>
                      <option value="syrians-in-california">
                        Syrians in USA
                      </option>
                      <option value="iraqis-in-california">
                        Iraqis in USA
                      </option>
                      <option value="lebanese-in-california">
                        Lebanese in USA
                      </option>
                      <option value="japanese-communities">
                        Japanese Community
                      </option>
                      <option value="spanish-communities">
                        Spanish Communities
                      </option>
                      <option value="portuguese-communities">
                        Portuguese Communities
                      </option>
                      <option value="french-communities">
                        French communities
                      </option>
                      <option value="english-communities">
                        English Communities
                      </option>
                      <option value="algerians-in-usa">Algerians in USA</option>
                      <option value="saudis-in-usa">Saudis in USA</option>
                      <option value="yemenis-in-usa">Yemenis in USA</option>
                    </select>
                  </div> */}

                {/* <div className="flex flex-col gap-3 mb-7">
                    <label className="text-base font-semibold">Language</label>
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          id="some_id"
                          className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                        />
                        <label htmlFor="some_id" className="cursor-pointer">
                          Arabic
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          id="some_id1"
                          className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                        />
                        <label htmlFor="some_id1" className="cursor-pointer">
                          Arabic
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          id="some_id2"
                          className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                        />
                        <label htmlFor="some_id2" className="cursor-pointer">
                          Arabic
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          id="some_id3"
                          className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                        />
                        <label htmlFor="some_id3" className="cursor-pointer">
                          Arabic
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          id="some_id4"
                          className="appearance-none w-4 h-4 cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
                        />
                        <label htmlFor="some_id4" className="cursor-pointer">
                          Arabic
                        </label>
                      </div>
                    </div>
                  </div> */}

                <button type="submit" className="bg-primary duration-300 text-white mb-3 px-6 py-3 rounded-full w-full hover:opacity-60">
                  Search
                </button>
                <button type="button" onClick={resetForm} className="border-2 duration-300 border-primary text-primary px-6 py-3 rounded-full w-full hover:bg-primary hover:text-white">
                  Reset Filters
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Category;
