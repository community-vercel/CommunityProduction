"use client";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
import supabase from "@/lib/supabase";
import { EyeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";

const Business = () => {
  const router = useRouter();
  const { user, user_meta } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [selectedRowsState, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        if (row.approved == "0") return "PENDING";
        if (row.approved == "1") return "APPROVED";
        if (row.approved == "2") return "REJECTED";
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link
            href={`/places/category/business/${row.id}`}
            className="underline"
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
        </>
      ),
    },
  ];

  const [business, setBusiness] = useState([]);
  const [filterText, setFilterText] = useState("");
  const filteredItems = business.filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.location &&
        item.location.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.phone &&
        item.phone.toLowerCase().includes(filterText.toLowerCase()))
  );

  useEffect(() => {
    if (
      !user &&
      (user_meta.role !== "super_admin" || user_meta.role !== "moderator")
    )
      router.push("/");
    getBusinesses();
  }, []);

  useEffect(() => {
    if (
      !user &&
      (user_meta.role !== "super_admin" || user_meta.role !== "moderator")
    )
      router.push("/");
  }, [user]);

  const getBusinesses = async () => {
    try {
      if (user_meta.role === "super_admin") {
        const { data, error } = await supabase
          .from("business")
          .select()
          .eq("isArchived", false);
        if (error) throw error;
        setBusiness(data);
      } else {
        const { data, error } = await supabase
          .from("business")
          .select()
          .eq("user_id", user.id)
          .eq("isArchived", false);
        if (error) throw error;
        setBusiness(data);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // select selected rows
  const onSelectRowChange = ({ selectedRows }) => {
    console.log(selectedRows);
    setSelectedRows(selectedRows);
  };

  // select status change
  const selectStatus = async (e) => {
    try {
      console.log(e.target.value);
      let upddateArray = [];
      let notification_operation = "";
      let notification_operation_mod = "";
      if (e.target.value === "approve") {
        upddateArray = selectedRowsState.map((row) => {
          return { id: row.id, approved: "1" };
        });
        notification_operation = "approve";
        notification_operation_mod = "approve_moderator";
      }
      if (e.target.value === "pending") {
        upddateArray = selectedRowsState.map((row) => {
          return { id: row.id, approved: "0" };
        });
        notification_operation = "pending";
      }
      if (e.target.value === "reject") {
        upddateArray = selectedRowsState.map((row) => {
          return { id: row.id, approved: "2" };
        });
        notification_operation = "reject";
      }
      if (e.target.value === "delete") {
        upddateArray = selectedRowsState.map((row) => {
          return { id: row.id, isArchived: true };
        });
        notification_operation = "delete";
      }

      if (e.target.value === "featured") {
        upddateArray = selectedRowsState.map((row) => {
          return { id: row.id, isFeatured: true };
        });
        notification_operation = "featured";
        notification_operation_mod = "featured_moderator";
      }

      if (e.target.value === "unfeatured") {
        upddateArray = selectedRowsState.map((row) => {
          return { id: row.id, isFeatured: false };
        });
        notification_operation = "unfeatured";
      }

      if (upddateArray.length > 0) {
        console.log(upddateArray);

        const { data, error } = await supabase
          .from("business")
          .upsert(upddateArray)
          .select();

        if (error) throw error;

        let notification_array = [];

        selectedRowsState.forEach((row) => {
          notification_array.push({
            recevier_id: row.user_id,
            notification_type: "business",
            notification_operation,
            related_entity_id: row.id,
          });
        });

        if (user_meta.role == "moderator") {
          selectedRowsState.forEach((row) => {
            notification_array.push({
              recevier_id: "admin",
              notification_type: "business",
              notification_operation:notification_operation_mod,
              related_entity_id: row.id,
            });
          });
        }

        const { error: notification_error } = await supabase
          .from("notification")
          .insert(notification_array);
        if (notification_error) throw notification_error;

        getBusinesses();
        setToggleClearRows(!toggledClearRows);
        toast.success("Updated", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] mx-auto pb-20">
          <div className="flex justify-end flex-wrap my-6">
            <Link
              href="/dashboard/business/add"
              className="bg-primary text-white text-center text-sm rounded-full py-2 px-9 border-8 border-white"
            >
              Add
            </Link>
          </div>
          <div className="mt-5">
            <DataTable
              title={
                <div className="pt-7">
                  <h1 className="text-2xl font-bold">Businesses</h1>
                  <div className="flex justify-between flex-wrap items-center w-full">
                    <select
                      onChange={selectStatus}
                      className="outline-none text-sm border border-gray-300 p-2 pr-4 cursor-pointer"
                    >
                      <option className="cursor-pointer" value="none">
                        Actions
                      </option>
                      {user_meta.role == "super_admin" && (
                        <>
                          <option className="cursor-pointer" value="featured">
                            Featured
                          </option>
                          <option className="cursor-pointer" value="unfeatured">
                            Unfeatured
                          </option>
                          <option className="cursor-pointer" value="approve">
                            Approve
                          </option>
                          <option className="cursor-pointer" value="pending">
                            Pending
                          </option>
                          <option className="cursor-pointer" value="reject">
                            Reject
                          </option>
                        </>
                      )}

                      {user_meta.role == "moderator" && (
                        <>
                          <option className="cursor-pointer" value="featured">
                            Featured
                          </option>
                          <option className="cursor-pointer" value="approve">
                            Approve
                          </option>
                        </>
                      )}

                      {user_meta.role != "moderator" && (
                        <option className="cursor-pointer" value="delete">
                          Delete
                        </option>
                      )}

                      
                    </select>
                    <SubHeaderComponent
                      filterText={filterText}
                      setFilterText={setFilterText}
                    />
                  </div>
                </div>
              }
              columns={columns}
              data={filteredItems}
              persistTableHead
              highlightOnHover
              fixedHeader
              clearSelectedRows={toggledClearRows}
              selectableRows
              onSelectedRowsChange={onSelectRowChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Business;
