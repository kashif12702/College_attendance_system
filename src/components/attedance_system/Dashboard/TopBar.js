import Link from "next/link";
import React from "react";
import { HiOutlineMoon, HiOutlineBars3CenterLeft } from "react-icons/hi2";
import { useAuth } from "util/auth";
import { useUser } from "util/db";
export default function TopBar({ setSidebarOpen }) {
  const auth = useAuth();
  const { data: userData } = useUser(auth?.user?.id);
  return (
    <>
      <div className="bg-white mt-[70px] flex  md:justify-end justify-between items-center w-full drop-shadow-xl z-30">
        <button
          type="button"
          className="mx-6 my-4rounded-md text-gray-500 hover:text-gray-900 md:hidden block"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <HiOutlineBars3CenterLeft className=" text-[#a02d29] text-4xl" />
        </button>
        <Link href="/">
          <div className="md:hidden block text-2xl font-bold text-[#a02d29]">
            GPCJ
          </div>
        </Link>
        <div className="flex items-center mx-5 my-3">
          {userData?.roleas !== "super_admin" ? (
            userData?.status === "Approved" ? (
              <h2 className="bg-green-600 p-2 text-sm text-white rounded-2xl ">
                {userData?.status}
              </h2>
            ) : (
              <h2 className="bg-red-600 p-2 text-sm text-white rounded-2xl ">
                {userData?.status}
              </h2>
            )
          ) : (
            <h2 className="bg-green-600 p-2 text-sm text-white rounded-2xl ">
              Admin
            </h2>
          )}
          <HiOutlineMoon className="ml-3 text-[#a02d29] text-2xl cursor-pointer" />
        </div>
      </div>
    </>
  );
}
// bg-[#a02d29] hover:bg-[#ad5350]
