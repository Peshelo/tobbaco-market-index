"use client"
import { Button } from "antd";
import Image from "next/image";
import pb from "@/lib/connection";

 
export default function Layout({ children }) {
  // const verify = async () => {
  //   await pb.collection('users').requestPasswordReset('gomopeshel@gmail.com');
  // }
  return (
    <div className="p-4 w-screen h-screen flex justify-center items-center bg-gradient-to-t from-green-800 to-green-700 gap-4">
      {/* <Button onClick={()=>verify()}>Verify</Button> */}
      <div className="h-fit w-[600px] p-5 border-2 bg-white shadow-sm rounded-md">
        {children}
      </div>
    

    </div>
  )
}