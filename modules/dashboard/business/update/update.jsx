"use client";
import Formlabel from "@/components/Formlabel";
import InputField from "@/components/InputField";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddBusinessZod } from "@/zod/AddBusinessZod";
import uploadImage from "@/utils/uploadImage";
import { useSelector } from "react-redux";
import SelectCountryDropdown from "@/components/SelectCountryDropdown";
import Image from "next/image";
import { extractImagePath } from "@/utils/extractImagePath";
import { XMarkIcon } from "@heroicons/react/16/solid";

import { 
  GetLanguages,CitySelect, StateSelect ,GetState,GetCity
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import supabase from "@/lib/supabase";


const Update = () => {
  const params = useParams();
  const router = useRouter();

  const { user_meta, user } = useSelector((state) => state.auth);

  const [buserid, setbuserid] = useState();
  const [categories, setCategories] = useState(null); //data coming from category tabel stored
  const [selectedCategories, setSelectedCategories] = useState(null); // local selected form data stored
  const [selectedCategoriesDB, setSelectedCategoriesDB] = useState(null); // DB selected form data stored
  const selectInputRef = useRef();

  const [logo, setLogo] = useState(null); //for logo input
  const [images, setImages] = useState([]); // for images input

  const [logoDB, setLogoDB] = useState(null); //for logo input
  const [imagesDB, setImagesDB] = useState([]); // for images input

  const [customErrors, setCustomErrors] = useState({}); // for files error

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);


  const [languageList, setLanguageList] = useState([]);
  const countryid = 233; 
  const [stateid, setstateid] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [selectedStateDB, setSelectedStateDB] = useState({});
  const [selectedCityDB, setSelectedCityDB] = useState({});

  useEffect(() => {
    if (user && !user.id) router.push("/");
    GetLanguages().then((result) => {
      setLanguageList(result);
    });

    // function to fill the form data from data base
    const getData = async () => {
      try {
        // get all current buiness categories
        const { data, error } = await supabase
          .from("category_business")
          .select(`category(id,name)`)
          .eq("business_id", params.id).eq("category.isArchived", false);
        let currentCategories =
          data.length > 0 &&
          data.map((item) => {
            return { label: item?.category?.name, value: item?.category?.id };
          }); 
        setSelectedCategoriesDB(currentCategories.filter(item => item.label != undefined || item.label != null));

        // get all available categories list
        const { data: allCats, error: alCatsError } = await supabase
          .from("category")
          .select().eq("isArchived", false);
        if (alCatsError) throw alCatsError;
        let reArrangeData = allCats.map((item) => {
          return { value: item?.id, label: item?.name };
        });
        setCategories(reArrangeData.filter(item => item.label != undefined || item.label != null));

        // get tags
        const { data: tags_data, error: tag_error } = await supabase
          .from("tag_business")
          .select("*")
          .eq("business_id", params.id)
          .limit(1);
        if (!tag_error) {setValue("b_tags", tags_data.tag);}
        

        // get business details
        const { data: businessDetails, error: businessDetailsError } =
          await supabase
            .from("business")
            .select("*")
            .eq("id", params.id)
            .single();
        if (businessDetailsError) throw businessDetailsError;
        setValue("b_name", businessDetails.name);
        setValue("b_description", businessDetails.description);
        setValue("b_email", businessDetails.email);
        setValue("b_phone", businessDetails.phone);
        setValue("b_website", businessDetails.website);
        setValue("b_location", businessDetails.location);
        setValue("b_operating_hours", businessDetails.operating_hours);
        // setValue("b_state", businessDetails.state);
        // setValue("b_country", businessDetails.country);
        // setValue("b_city", businessDetails.city);
        setValue("b_zip", businessDetails.zip);
        setValue("b_facebook", businessDetails.socials?.facebook);
        setValue("b_instagram", businessDetails.socials?.instagram);
        setValue("b_youtube", businessDetails.socials?.youtube);
        setValue("b_tiktok", businessDetails.socials?.tiktok);
        setValue("b_twitter", businessDetails.socials?.twitter);
        setValue("b_discount_code", businessDetails.discount_code);
        setValue("b_discount_message", businessDetails.discount_message);
        setValue("b_language", businessDetails.language);

        setLogoDB(businessDetails.logo);
        setImagesDB(businessDetails.images);
        setbuserid(businessDetails.user_id)
        setLoading(false); 

        GetState(countryid).then((states) => {
          states.map(state => {
            if(state.name === businessDetails.state) {
              setSelectedStateDB(state)
              GetCity(countryid, state.id).then((cities) => {
                cities.map(city =>{
                  if(city.name === businessDetails.city){
                    setSelectedCityDB(city) 
                  }
                })
              });
            }
          })
        });  

      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(AddBusinessZod),
  });

  // update form data
  const onSubmit = async (formData) => {
    try {
      setAdding(true);
      let socials = {
        facebook: formData.b_facebook,
        instagram: formData.b_instagram,
        youtube: formData.b_youtube,
        tiktok: formData.b_tiktok,
        twitter: formData.b_twitter,
      };
      let businessData = {
        name: formData.b_name,
        description: formData.b_description,
        phone: formData.b_phone,
        email: formData.b_email,
        website: formData.b_website,
        operating_hours: formData.b_operating_hours,
        location: formData.b_location,
        city: selectedCity ? selectedCity : selectedCityDB.name,
        state: selectedState ? selectedState : selectedStateDB.name,
        country: formData.b_country,
        zip: formData.b_zip,
        user_id: buserid,
        socials,
        discount_code:formData.b_discount_code,
        discount_message:formData.b_discount_message,
        language:formData.b_language
      };
      console.log(businessData)
      const { error: b_error } = await supabase
        .from("business")
        .update(businessData)
        .eq("id", params.id);
      if (b_error) throw b_error;
      if (selectedCategories && selectedCategories.length) {
        // agr selected km h DB wali mn sy to DB wali my sy wo filter out kro jo del krni h
        if (selectedCategories.length < selectedCategoriesDB.length) {
          const categoriesToDelete = selectedCategoriesDB.filter(
            (dbItem) =>
              !selectedCategories.some(
                (selectedItem) => selectedItem.value === dbItem.value
              )
          );
          const response = await supabase
            .from("category_business")
            .delete()
            .in(
              "category_id",
              categoriesToDelete.map((item) => item.value)
            )
            .eq("business_id", params.id);
          // agr del krny walo ki and db walo ki lenght same h to check kro k dono ki ids match krti hen ya nae? agrr match krti hen to mtlb selectedCategories mn new category h
          if (selectedCategoriesDB.length == categoriesToDelete.length) {
            const matchBoth = selectedCategoriesDB.filter((item) =>
              categoriesToDelete.some((item2) => item.value == item2.value)
            );
            let transformCats = selectedCategories.map((cat) => {
              return { category_id: cat.value, business_id: params.id };
            });
            const { error: cat_error } = await supabase
              .from("category_business")
              .insert(transformCats);
            if (cat_error) throw cat_error;
            setSelectedCategories([]);
          }
        }
        // agr selectedCategories ki lenght zada h to filter out categories to add and them
        else if (selectedCategories.length >= selectedCategoriesDB.length) {
          const categoriesToAdd = selectedCategories.filter(
            (dbItem) =>
              !selectedCategoriesDB.some(
                (selectedItem) => selectedItem.value === dbItem.value
              )
          );
          let transformCats = categoriesToAdd.map((cat) => {
            return { category_id: cat.value, business_id: params.id };
          });
          const { error: cat_error } = await supabase
            .from("category_business")
            .insert(transformCats);
          if (cat_error) throw cat_error;
          setSelectedCategories([]);
        }
        // agr db m koi record nae h lekin new category added h
        else if (selectedCategories.length > 0 && !selectedCategoriesDB) {
          let transformCats = selectedCategories.map((cat) => {
            return { category_id: cat.value, business_id: params.id };
          });
          const { error: cat_error } = await supabase
            .from("category_business")
            .insert(transformCats);
          if (cat_error) throw cat_error;
          setSelectedCategories([]);
        }
      }

      // check if form has tags added, if have then add to tag_business relation
      if (formData.b_tags) {
        const { error } = await supabase
          .from("tag_business")
          .upsert({ tag: formData.b_tags,business_id:params.id }) 
        if (error) throw error;
        console.log("business tags done");
      }

      // imgs and logo
      if (logo) {
        if(logoDB) {
          const oldLogoUrl = extractImagePath(logoDB).replace("business/", "");
          const { data: oldLogoRemoveData, error: oldLogoRemoveError } =
            await supabase.storage.from("business").remove([oldLogoUrl]);
          if (oldLogoRemoveError) throw oldLogoRemoveError;
        }
        
        //  upload logo
        const uploadBusinessLogo = await uploadImage(
          params.id,
          logo,
          "business",
          `${params.id}/`
        );
        if (uploadBusinessLogo.error) throw uploadBusinessLogo.error;
        const { data: updateLogoData, error: updateLogoError } = await supabase
          .from("business")
          .update({ logo: uploadBusinessLogo[0].url })
          .eq("id", params.id)
          .select();
      }
      if (images.length>0) {
        const uploadBusinessImages = await uploadImage(
          params.id,
          images,
          "business",
          `${params.id}/`
        );
        if (uploadBusinessImages.error) throw uploadBusinessImages.error;
        
        let imagesUploadArr = uploadBusinessImages
          .map((img) => img.url)
          .join(",");
        if (imagesDB && imagesDB.split(",").length > 0)
          imagesUploadArr = imagesUploadArr + "," + imagesDB;
        console.log(imagesUploadArr.split(","));


        const { data: updateImagesData, error: updateImagesError } =
          await supabase
            .from("business")
            .update({ images: imagesUploadArr })
            .eq("id", params.id)
            .select();
        if (updateImagesError) throw updateImagesError;
      }
      console.log("updated");


      

      let notification_operation;
      let recevier_id;
      if(user_meta.role == "super_admin"){
        notification_operation = 'admin_update'
        recevier_id = buserid
      }else{
        notification_operation = 'user_update'
        recevier_id= 'admin'
      }
      const notification_data = {
        recevier_id,
        notification_type:'business',
        notification_operation,
        related_entity_id:params.id
      }
      const { error:notification_error } = await supabase
      .from('notification')
      .insert(notification_data)
      if(notification_error) throw notification_error



      router.push("/places/category/business/" + params.id);
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const imgDelete = async (name) => {
    console.log(name);
    if (name.includes("http")) {
      try {
        setImagesDB(
          [...imagesDB.split(",").filter((img) => img !== name)].join(",")
        );

        const oldUrl = extractImagePath(name).replace("business/", "");
        const { data: oldUrlData, error: oldUrlError } = await supabase.storage
          .from("business")
          .remove([oldUrl]);
        if (oldUrlError) throw oldUrlError;

        const { data: updateImagesData, error: updateImagesError } =
          await supabase
            .from("business")
            .update({
              images: [
                ...imagesDB.split(",").filter((img) => img !== name),
              ].join(","),
            })
            .eq("id", params.id)
            .select();
        if (updateImagesError) throw updateImagesError;
        console.log(
          [...imagesDB.split(",").filter((img) => img !== name)].join(",")
        );
      } catch (error) {}
    } else {
      setImages(images.filter((file) => file.name != name));
    }
    console.log(images);
  };

  return (
    <>
      {loading ? (
        <div className="">Loading ... </div>
      ) : (
        <div className="p-7 b__Add">
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="">
              <Formlabel text="Name" forLabel="b_name" />
              <InputField
                inputId="b_name"
                inputName="b_name"
                inputType="text"
                register={register}
                error={errors.b_name}
              ></InputField>
            </div>

            <div className="mb-5">
              <Formlabel text="Update Logo" forLabel="logo" />
              <input
                id="logo"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setLogo(Array.from(e.target.files));
                  setCustomErrors({
                    ...customErrors,
                    logo: "",
                  });
                }}
                className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="logo"
              />
              {logoDB ? (
                <div className="flex gap-4 items-center">
                  <span>Current logo:</span>
                  <Image
                    src={logoDB}
                    alt=""
                    className="w-14 h-14 my-4 rounded-full bg-white d-flex p-1"
                    width={100}
                    height={100}
                  />
                </div>
              ) : logo && logo.length > 0 && <div className="flex gap-4 items-center">
              <span>Current logo:</span>
              <Image
                src={URL.createObjectURL(logo[0])}
                alt=""
                className="w-14 h-14 my-4 rounded-full bg-white d-flex p-1"
                width={100}
                height={100}
              />
            </div>}
              {customErrors.logo && (
                <span className="text-red-400 text-sm pl-1">
                  {customErrors.logo}
                </span>
              )}
            </div>

            <div className="mb-5">
              <Formlabel text="Update Images" forLabel="images" />
              <input
                id="images"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setImages([...images, ...Array.from(e.target.files)]);
                  setCustomErrors({
                    ...customErrors,
                    images: "",
                  });
                }}
                className="rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white pl-5 pr-5 border-2 border-[#E4E4E4] w-full"
                type="file"
                name="images"
                multiple
              />
              {(imagesDB || images.length > 0) && (
                <div className="">
                  <span className="inline-block mt-4 mb-1">
                    Current Images:
                  </span>
                  <div className="flex gap-4 items-center flex-wrap">
                    {[...images].map((item, index) => (
                      <>
                        {item && (
                          <div className="relative h-full" key={index}>
                            <Image
                              key={index}
                              src={
                                typeof item == "string"
                                  ? item
                                  : URL.createObjectURL(item)
                              }
                              alt=""
                              className="aspect-square rounded-sm  bg-white d-flex p-1"
                              width={180}
                              height={180}
                            />
                            <XMarkIcon
                              className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                              onClick={() =>
                                imgDelete(
                                  typeof item == "string" ? item : item.name
                                )
                              }
                            />
                          </div>
                        )}
                      </>
                    ))}

                    {imagesDB &&
                      imagesDB.split(",").length > 0 &&
                      [...imagesDB?.split(",")].map((item, index) => (
                        <>
                          {item && (
                            <div className="relative h-full" key={`index${index}`}>
                              <Image
                                key={index}
                                src={
                                  typeof item == "string"
                                    ? item
                                    : URL.createObjectURL(item)
                                }
                                alt=""
                                className="aspect-square rounded-sm  bg-white d-flex p-1"
                                width={180}
                                height={180}
                              />
                              <XMarkIcon
                                className="w-4 h-4 absolute top-3 right-2 cursor-pointer bg-white text-black rounded-full"
                                onClick={() =>
                                  imgDelete(
                                    typeof item == "string" ? item : item.name
                                  )
                                }
                              />
                            </div>
                          )}
                        </>
                      ))}
                  </div>
                </div>
              )}
              {customErrors.images && (
                <span className="text-red-400 text-sm pl-1">
                  {customErrors.images}
                </span>
              )}
            </div>

            <div className="">
              <Formlabel text="Description" forLabel="b_description" />
              <InputField
                inputId="b_description"
                inputName="b_description"
                inputType="textarea"
                register={register}
                error={errors.b_description}
              ></InputField>
            </div>
            <div className="">
              <Formlabel text="Email" forLabel="b_email" />
              <InputField
                inputId="b_email"
                inputName="b_email"
                inputType="email"
                register={register}
                error={errors.b_email}
              ></InputField>
            </div>

            <div className="mb-5">
              <Formlabel text="Language" forLabel="b_language" />
              <select
                id="b_language"
                className={`rounded-full border-2 border-[#E4E4E4] w-full  outline-none shadow-formFeilds text-text-gray text-sm p-4 bg-white`}
                placeholder="Please select country"
                {...register('b_language')} 
              >
                {languageList.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select> 
            </div>




            <div className="">
              <Formlabel text="Zipcode" forLabel="b_zip" />
              <InputField
                inputId="b_zip"
                inputName="b_zip"
                inputType="text"
                register={register}
                error={errors.b_zip}
              ></InputField>
            </div>

            <div className="mb-5">
              <Formlabel text="State" forLabel="b_state" />
              <StateSelect
                required
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

                defaultValue={selectedStateDB}
              /> 
            </div>

            <div className="mb-5">
              <Formlabel text="City" forLabel="b_city" />
              <CitySelect
                required
                countryid={countryid}
                stateid={stateid ? stateid : selectedStateDB.id}
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
                defaultValue={selectedCityDB}
              />
            </div>

            <div className="">
              <Formlabel text="Address" forLabel="b_location" />
              <InputField
                inputId="b_location"
                inputName="b_location"
                inputType="text"
                register={register}
                error={errors.b_location}
              ></InputField>
            </div>
            <div className="">
              <Formlabel text="Phone No." forLabel="b_phone" />
              <InputField
                inputId="b_phone"
                inputName="b_phone"
                inputType="text"
                register={register}
                error={errors.b_phone}
              ></InputField>
            </div>
            <div className="">
              <Formlabel text="Website" forLabel="b_website" />
              <InputField
                inputId="b_website"
                inputName="b_website"
                inputType="text"
                register={register}
                error={errors.b_website}
              ></InputField>
            </div>

            <div className="">
              <Formlabel text="Facebook" forLabel="b_facebook" />
              <InputField
                inputId="b_facebook"
                inputName="b_facebook"
                inputType="text"
                register={register}
                error={errors.b_facebook}
              ></InputField>
            </div>

            <div className="">
              <Formlabel text="Instagram" forLabel="b_instagram" />
              <InputField
                inputId="b_instagram"
                inputName="b_instagram"
                inputType="text"
                register={register}
                error={errors.b_instagram}
              ></InputField>
            </div>

            <div className="">
              <Formlabel text="Youtube" forLabel="b_youtube" />
              <InputField
                inputId="b_youtube"
                inputName="b_youtube"
                inputType="text"
                register={register}
                error={errors.b_youtube}
              ></InputField>
            </div>

            <div className="">
              <Formlabel text="Tiktok" forLabel="b_tiktok" />
              <InputField
                inputId="b_tiktok"
                inputName="b_tiktok"
                inputType="text"
                register={register}
                error={errors.b_tiktok}
              ></InputField>
            </div>

            <div className="">
              <Formlabel text="Twitter" forLabel="b_twitter" />
              <InputField
                inputId="b_twitter"
                inputName="b_twitter"
                inputType="text"
                register={register}
                error={errors.b_twitter}
              ></InputField>
            </div>

            <div className="">
              <Formlabel text="Operating Hours" forLabel="b_operating_hours" />
              <InputField
                inputId="b_operating_hours"
                inputName="b_operating_hours"
                inputType="text"
                register={register}
                error={""}
              ></InputField>
            </div>

            <div className="">
          <Formlabel text="Discount Code" forLabel="b_discount_code" />
          <InputField
            inputId="b_discount_code"
            inputName="b_discount_code"
            inputType="text"
            register={register}
            error={""}
          ></InputField>
        </div>

        <div className="">
          <Formlabel text="Discount Message" forLabel="b_discount_message" />
          <InputField
            inputId="b_discount_message"
            inputName="b_discount_message"
            inputType="text"
            register={register}
            error={""}
          ></InputField>
          <span className="flex mb-5 -mt-3 text-gray-600 text-sm pl-4">Use [code] to show discount code in your discount message.</span>
        </div>

            {categories && (
              <div className="">
                <Formlabel text="Select Categories" forLabel="b_categories" />
                <Select
                  isMulti
                  defaultValue={
                    selectedCategoriesDB.length > 0 &&
                    selectedCategoriesDB.map((ele) => ele)
                  }
                  ref={selectInputRef}
                  name="b_categories"
                  options={categories}
                  className="cursor-pointer"
                  classNamePrefix="select_custom"
                  onChange={(e) => {
                    setSelectedCategories(e);
                  }}
                />
              </div>
            )}

            <div className="mt-5">
              <Formlabel text="Tags (comma seperated)" forLabel="b_tags" />
              <InputField
                inputId="b_tags"
                inputName="b_tags"
                inputType="textarea"
                register={register}
                error={""}
              ></InputField>
            </div>

            <button
              type="submit"
              className="rounded-full my-5 uppercase shadow-btnShadow outline-none bg-primary text-white text-xs font-semibold py-4 pl-10 pr-5 w-full disabled:bg-gray-600"
              disabled={adding}
            >
              {adding ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Update;
