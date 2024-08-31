"use client"
import pb from "@/lib/connection";
// import pb from "@/app/lib/connection";
import Link from "next/link";
import { useState } from "react";
// import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { Button, Input } from "antd";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Page() {
    const router = useRouter();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: ''
    });

    async function register(e) {
        // const router = useRouter();
        e.preventDefault();

        setError('');

        //if username is empty or password is empty
        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        try {
            const authData = await pb.collection('users').authWithPassword(
                formData.username,
                formData.password,
            );
            toast.success("User Login succesful")
            let userRole = authData.record.role
            if(userRole == "SUPER_ADMIN"){
                router.push('/admin')
            }else if(userRole == "MERCHANT"){
                router.push('/merchant')
                
            }else{
                throw Error("Failed to login")
            }
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <>
            <div className="flex flex-col h-full w-full justify-center items-center p-10 max-md:p-2">
                <form className="w-full flex flex-col gap-y-2 items-center">
                    <Link href="/" className="p-2 text-xl font-bold rounded-sm flex flex-col items-center gap-y-2">
                         <Image className="rounded" alt='logo' src={'/assets/images/logo.png'} width={60} height={60} loading="lazy"/>
                         <label className="text-sm text-gray-400">Tobbaco Market Index</label>
                    </Link>
                    <h1 className="w-full text-center text-xl font-semibold my-2">Sign In</h1>
                    <p className="text-red-600 text-sm w-full">{error}</p>
                    <Input type="email" size="large" placeholder="Email" name="username" className="my-2" value={formData.username} onChange={handleInputChange} onFocus={()=>setError('')} />
                    <Input size="large" type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} onFocus={()=>setError('')}/>
                    <Button className="bg-lime-700" block size="large" onClick={register} type="primary">Login</Button>
                    <p className="my-2 text-sm text-gray-500 w-full text-center"><Link className="text-gray-600 underline underline-offset-1" href={'/auth/forgot-password'}>Forgot password?</Link></p>
                </form>
                {/* <label className='w-full text-center mt-4 p-2 text-gray-600'>Do not have an account? <Link href={'/auth/sign-up'} className='text-green-600'>Sign up</Link></label> */}

            </div>

        </>
    );
}
