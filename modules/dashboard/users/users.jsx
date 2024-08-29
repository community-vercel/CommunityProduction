"use client";
import  supabase  from "@/lib/supabase";
import  supabaseAdmin  from "@/lib/supabaseAdmin";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import SubHeaderComponent from "@/components/datatable-components/SubHeaderComponent";
import Loader from "@/components/Loader";
import Link from "next/link";

const Users = () => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Pre-Approved",
      cell: (row) => <CustomDropdown row={row} onChange={handleOnChange} />,
    },
    {
      name: "Actions",
      selector: (row) => <Link href={`/dashboard/users/${row.id}`}> View </Link>,
      sortable: true,
    }
  ];

  const handleOnChange = async (e, row) => {
    console.log(e.target.value, row);
    try {
      const { error } = await supabase
        .from("user_meta")
        .update({ pre_approved: e.target.value })
        .eq("user_id", row.id);
      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };

  const [filterText, setFilterText] = useState("");
  const filteredItems = users.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    if (!user.id) return router.push("/");
    getAllUsers();
  }, []);

  useEffect(() => {
    if (!user.id) return router.push("/");
  }, [user]);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const {
        data: { users: usersData },
        error,
      } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      let authUsers = [...usersData];

      const { data: users_meta, error: users_meta_error } = await supabase
        .from("user_meta")
        .select(`*`);
      if (users_meta_error) throw users_meta_error;
      let usersMeta = [...users_meta];

      let transformedData = [];
      usersMeta.forEach((meta) => {
        authUsers.forEach((authUser) => {
          if (meta.user_id == authUser.id && meta.role !== "super_admin") {
            transformedData.push({
              id: meta.user_id,
              role: meta.role,
              pre_approved: meta.pre_approved,
              name: authUser.user_metadata.full_name,
              email: authUser.email,
            });
          }
        });
      });

      console.log(transformedData);
      setUsers(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] mx-auto pb-20">
          <div className="mt-5">
            <DataTable
              title={
                <div className="flex justify-between flex-wrap items-center w-full">
                  <h1 className="text-2xl font-bold">Users</h1>
                  <SubHeaderComponent
                    filterText={filterText}
                    setFilterText={setFilterText}
                  />
                </div>
              }
              columns={columns}
              data={filteredItems}
              persistTableHead
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Users;

const CustomDropdown = ({ row, onChange }) => {
  const [status, setStatus] = useState(row.pre_approved || "false");
  const options = [
    { value: true, label: "True", color: "green" },
    { value: false, label: "False", color: "red" },
  ];

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onChange(e, row);
  };

  return (
    <div className="relative inline-block cursor-pointer">
      <select
        value={status}
        onChange={handleChange}
        className={`pl-6 pr-4 py-1 border cursor-pointer rounded-md appearance-none focus:outline-none focus:ring-2 ${
          status == true || status == "true" ? "text-green-500" : "text-red-500"
        } font-bold uppercase`}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={`text-${option.color}-600 uppercase font-bold cursor-pointer`}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
          status == true || status == "true" ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
    </div>
  );
};
