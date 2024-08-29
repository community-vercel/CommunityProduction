"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
import supabase from "@/lib/supabase";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

const Categories = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            href={`/dashboard/categories/update/${row.id}`}
            className="underline"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
          {/* {row.user_id == user.id ? (
            <Link
              href={`/dashboard/business/update/${row.id}`}
              className="underline"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </Link>
          ) : (
            "No actions avaiable"
          )} */}
        </>
      ),
    },
  ];

  const [category, setCategory] = useState([]);
  const [filterText, setFilterText] = useState("");
  const filteredItems = category.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    if (user && !user.id) router.push("/");
    const getCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("category").select().eq("isArchived", false);
        if (error) throw error;
        setCategory(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] mx-auto">
          <div className="flex justify-end flex-wrap my-6">
            <Link
              href="/dashboard/categories/add"
              className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white"
            >
              Add
            </Link>
          </div>
          <div className="mt-5">
            <DataTable
              title={
                <div className="flex justify-between flex-wrap items-center w-full">
                  <h1 className="text-2xl font-bold">Categories</h1>
                  <SubHeaderComponent
                    filterText={filterText}
                    setFilterText={setFilterText}
                  />
                </div>
              }
              columns={columns}
              data={filteredItems}
              persistTableHead
              striped
              highlightOnHover
              pointerOnHover
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
