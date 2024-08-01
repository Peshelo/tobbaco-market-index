"use client"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import pb from "@/lib/connection";
import { HiAdjustmentsVertical, HiCalendar, HiChartBar, HiMiniSquares2X2, HiUser } from "react-icons/hi2";
import { toast } from "react-toastify";
import { IoLogOut } from "react-icons/io5";
import { Avatar, Button } from "antd";

const links = [
  { href: '/merchant', label: 'Dashboard', icon: HiMiniSquares2X2 },
  { href: '/merchant/market-index', label: 'Market Index', icon: HiChartBar },
  { href: '/merchant/bookings', label: 'Bookings', icon: HiCalendar },
  { href: '/merchant/profile', label: 'Profile', icon: HiUser },
  // { href: '/merchant/settings', label: 'Settings', icon: HiAdjustmentsVertical }
];

export default function DashboardLayout({ children }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    pb.authStore.clear();
    router.push('/auth/sign-in');
  }

  const fetchUserDetails = () => {
    try {
      const model = pb.authStore.model;
      setUsername(model.username);
      setEmail(model.email);
      console.warn(model)
    } catch (e) {
      toast.error(e.message)
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <section className="w-screen h-screen overflow-hidden flex flex-row">
      <div className="flex flex-col text-green-700 bg-green-700 text-white gap-y-4 pb-4 border-l w-[250px] max-sm:w-[70px]">
        <div className="max-sm:hidden">
          <Link href={'/super_admin'} className="p-6 border-b text-white w-full flex flex-col items-center gap-y-2 justify-center">
            <img src="/assets/images/logo.png" alt="logo" className="size-20 rounded-xl" />
            <label className="text-sm text-gray-300">{email}</label>
          </Link>
        </div>

        <div className="flex-grow">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`p-4 w-full flex flex-row items-center justify-start duration-150 ${pathname === link.href ? 'bg-green-900' : 'hover:bg-green-800'}`}>
              <link.icon size={20} className="text-white" />
              <p className="max-sm:hidden mx-2">{link.label}</p>
            </Link>
          ))}
        </div>

        <Button size="large" className="w-full flex flex-row justify-start items-center mt-auto border-none hover:bg-red-700 bg-transparent text-white" onClick={logout}>
          <IoLogOut size={20} />
          <p className="max-sm:hidden mx-2" variant="secondary">Logout</p>
        </Button>
      </div>

      <div className="w-full">
        <div className="h-full border-l bg-gray-100 overflow-y-auto">
          <div className="p-4 text-green-700 bg-white w-full flex flex-row items-center justify-between mb-4 border-b top-0 sticky">
            <div>{pathname.replace('/merchant/', '').toUpperCase().replace('/','') || 'DASHBOARD'} DASHBOARD</div>
            <div className="flex flex-row items-center gap-x-2">
              <div className="px-2 rounded-none max-sm:justify-center flex flex-row gap-x-2 items-center">
                <Avatar name={username} />
                <div className="max-sm:hidden flex flex-col">
                  <h2 className="text-md text-gray-500">{username}</h2>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-y-4">
            {/* Breadcrumb */}
            <div className="flex text-xs flex-row gap-x-2">
              <Link href={'/'} className="text-green-900">Home</Link>
              <p>/</p>
              <Link href={'/merchant'} className="text-green-900">Merchant</Link>
              {pathname !== '/merchant' && (
                <>
                  <p>/</p>
                  <Link href={pathname} className="text-green-900">{pathname.replace('/merchant/', '')}</Link>
                </>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
