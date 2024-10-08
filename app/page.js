"use client";
import BottomNav from "@/components/bottomNav";
import MarketIndex from "@/components/marketIndex";
import TopNav from "@/components/topNav";
import { Button, FloatButton, Input, InputNumber, Select, message } from "antd";
import Search from "antd/es/transfer/search";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiBell, HiCalendar, HiChartBar, HiChartPie, HiHome, HiMiniCog6Tooth } from "react-icons/hi2";
import { HiOutlineChartBar } from "react-icons/hi2";
import { IoChatbubble } from "react-icons/io5";
import { HiDatabase, HiMap, HiClock, HiCheckCircle, HiUserGroup, HiTrendingUp, HiSupport } from "react-icons/hi";
import PocketBase from 'pocketbase';
import pb from '@/lib/connection';

export default function Home() {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const options = [
    { label: "Grade A", value: "A" },
    { label: "Grade B", value: "B" },
    { label: "Grade C", value: "C" },
    { label: "Grade D", value: "D" },
  ];

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const createAdmin = async () => {
    setLoading(true);
    try {
      await pb.collection('users').create({
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'password',
        passwordConfirm: 'password',
        role: 'SUPER_ADMIN'
      });
      message.success('Admin account created successfully.');
    } catch (error) {
      message.error('Failed to create admin account.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex overflow-hidden min-h-screen flex-col items-center">
      <TopNav/>

      {/* Main Content */}
      <div className="relative w-full h-[500px] flex flex-col justify-center items-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url(/assets/images/bg.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-green-600 opacity-40"></div>
        <div className="w-full flex flex-col justify-center items-center p-2 relative space-y-4 text-center">
          <h1 className="text-white text-4xl font-bold">WELCOME TO TOBBACO FLOOR BOOKING</h1>
          <p className="text-white text-lg">The best place to get the latest market prices for tobbaco and book</p>
          <Link href={'/market'} className="bg-lime-500 rounded p-2 text-gray-700">Book A Day</Link>
        </div>
      </div>
      
      <div className="w-full bg-lime-50">
        <div className="flex flex-row flex-wrap gap-2 text-sm items-center justify-between p-4 py-6 max-w-[1200px] mx-auto">
          {Array(4).fill(<div className="flex flex-row">
            <IoChatbubble size={25} className="text-lime-700"/>
            <div className="flex flex-col ml-2">
              <h1 className="text-gray-700 font-semibold">Chat with us</h1>
              <p className="text-gray-700 font-light">Get in touch with us for any queries</p>
            </div>
          </div>)}
        </div>
      </div>

      {/* Features */}
      <div id="services" className="section p-4 pt-[20px] w-full bg-white">
        <div className="container mx-auto px-4">
          <header className="text-center mx-auto mb-12 lg:px-20">
            <h2 className="text-2xl leading-normal mb-2 font-bold text-black">Features</h2>
            <p className="text-gray-500 leading-relaxed font-light text-xl mx-auto pb-2">
              Manage your tobacco sales and bookings efficiently with real-time updates and tracking.
            </p>
          </header>
          <div className="flex flex-wrap flex-row -mx-4 text-center">
            {[
              { title: "Live Tobacco Market Index", description: "Get real-time updates on the current tobacco market prices.", icon: <HiTrendingUp size={32} /> },
              { title: "Book Floor Space", description: "Easily book floor space for your tobacco sales.", icon: <HiCalendar size={32} /> },
              { title: "Real-Time Notifications", description: "Receive instant notifications on your bookings and market changes.", icon: <HiBell size={32} /> },
              { title: "Track Sales", description: "Monitor your sales performance and history.", icon: <HiChartPie size={32} /> },
              { title: "Customer Support", description: "Get assistance with your bookings and sales queries.", icon: <HiSupport size={32} /> },
              { title: "Data Analytics", description: "Analyze your sales data to make informed decisions.", icon: <HiChartBar size={32} /> },
            ].map((service, index) => (
              <div key={index} className="flex-shrink rounded-lg px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                <div className="group py-8 px-12 mb-12 bg-background border-b border-gray-100 transform transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-green-600 hover:text-white hover:shadow-lg rounded-lg">
                  <div className="inline-block mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg leading-normal mb-2 font-semibold">{service.title}</h3>
                  <p className="text-gray-500 group-hover:text-gray-200">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        type="primary"
        onClick={createAdmin}
        loading={loading}
        className="mt-4"
      >
        Create Admin
      </Button>
      <BottomNav/>
    
    </main>
  );
}
