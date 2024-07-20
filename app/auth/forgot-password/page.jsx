"use client"
import pb from "@/lib/connection";
// import pb from "@/app/lib/connection";
import Link from "next/link";
import { useState } from "react";
// import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { Button, Input } from "antd";
import Image from "next/image";

export default function Page() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    async function register() {
        // alert('register')
        setErrorMsg('')
        // const router = useRouter();
        //If username is empty
        if(username == ''){
            setErrorMsg("*Username is required")
            return;
        }
        e.preventDefault();
        try {
            


            // const authData = await pb.collection('users').authWithPassword(
            //     formData.username,
            //     // formData.password,
            // );
            // toast.success("User Login succesful")
            // let userRole = authData.record.role
            // if(userRole == "SUPER_ADMIN"){
            //     router.push('/super_admin')
            // }else if(userRole == "MERCHANT"){
            //     router.push('/merchant')
            // }else{
            //     throw Error("Failed to login")
            // }
            // router.push('/dashboard')
            // router.push({
            //     pathname: '/search',
            //     query: {
            //         // search: searchInput,
            //     },
            // })

        } catch (error) {
            toast.error(error.message)
        }
    }
    

    const handleInputChange = (e) => {
        // const { name, value } = e.target;
        // setFormData({ ...formData, [name]: value });
    };

    return (
        <>
            <div className="flex flex-col h-full w-full justify-center items-center p-10">
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    register()}} className="w-full flex flex-col gap-y-2 items-center">
                    <Link href="/" className="p-2 text-xl font-bold rounded-sm flex flex-col items-center gap-y-2">
                         <Image className="rounded" alt='logo' src={'/assets/images/logo.png'} width={50} height={50} loading="lazy"/>
                         <label className="text-sm text-gray-400">Tobbaco Market Index</label>
                    </Link>
                    <h1 className="w-full text-center text-xl font-semibold my-2">Forgot Password</h1>
                    <p className="text-sm text-left w-full text-red-400">{errorMsg}</p>
                    <Input size="large" type="email" placeholder="Email" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} onFocus={()=>setErrorMsg('')} />

                    {/* <Input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange}/> */}
                    <Button type="primary" className="w-full p-2">Sent reset to email</Button>
                    <p className="my-2 text-sm text-gray-600 w-full text-center"><Link className="text-black underline underline-offset-1" href={'/auth/sign-in'}>Go to Login</Link></p>
                </form>
            </div>

        </>
    );
}
