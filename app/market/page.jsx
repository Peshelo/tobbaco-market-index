"use client"
import React, { useState } from 'react';
import BottomNav from '@/components/bottomNav';
import MarketIndex from '@/components/marketIndex';
import TopNav from '@/components/topNav';
import { Button, Col, Divider, Input, Modal, Row, Tag } from 'antd';
import { HiTrendingUp, HiCalendar, HiBell, HiChartPie, HiSupport, HiChartBar } from 'react-icons/hi';
import { toast } from 'react-toastify';
import pb from '@/lib/connection';

const Market = () => {
    const [referenceId,setReferenceId] = useState();
    const [isOpen,setIsOpen] = useState();
    const [myBooking,setMyBooking] = useState({})
    const [loading,setLoading] = useState(false)

    const trackBooking = async ()=>{
        if(referenceId){
            setLoading(true)
            setIsOpen(true)
            try{
                const record = await pb.collection('bookings').getOne(referenceId, {
                    expand: 'merchant',
                });
                
                setMyBooking(record);
                console.log(record)
            }catch(e){
                toast.error(e.message)
                console.log(e)
            }finally{
                setLoading(false)
            }
        }else{
            toast.info('Enter reference id')
            return
        }

    }
    const cancelBooking = async (id)=>{
        try{
            const record = await pb.collection('bookings').getOne(referenceId, {
                expand: 'merchant',
            }); 
            const data = {
                "merchant": record?.merchant,
                "firstName": record?.firstName,
                "lastName": record?.lastName,
                "phoneNumber": record?.phoneNumber,
                "date": record?.date,
                "status": "CANCELLED",
                "message": "Customer has cancelled case",
                "email": record?.email,
            "nationalId": record?.nationalId
            };
            const response = await pb.collection('bookings').update(record.id, data);
            toast.success('Record has been cancelled')
            setIsOpen(false)
        }catch(e){
                toast.error(e.message)
        }
    }
    return (
        <div className="bg-gray-100 min-h-screen">
            <TopNav />
            <Modal title="My Booking" loading={loading} open={isOpen} onCancel={()=>setIsOpen(false)} onOk={()=>setIsOpen(false)}>
            <div className='flex flex-col gap-y-2'>
            <p>Name: {myBooking.firstName} {myBooking.lastName}</p>
            {/* <Divider>Contact Details</Divider> */}
            <p>PhoneNumber: {myBooking.phoneNumber}</p>
            <p>Email: {myBooking.email}</p>
            {/* <Divider>Booking</Divider> */}
            <p>Queue Number: {myBooking.lineNumber == 0 ? 'No line number' : myBooking.lineNumber}</p>

            <p>Status: <Tag color='blue'>{myBooking.status}</Tag></p>
            <p>Date: {myBooking.date}</p>
            <Button onClick={()=>cancelBooking(referenceId)} type='primary' className='bg-red-600' block>I want to cancel my booking</Button>
            </div>
            </Modal>
            <div className="relative w-full h-[200px] text-white bg-no-repeat bg-cover"  style={{ backgroundImage: 'url(/assets/images/stocks.jpg)' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-green-600 opacity-70"></div>

            <div className="max-w-[1200px] relative h-full flex flex-col justify-center mx-auto">
                    <h1 className="text-4xl font-bold">Market Index</h1>
                    <p className="text-lg">Latest market prices for tobacco</p>
                    <div className='flex flex-row gap-x-2 items-center'>
                    <Input className='mb-2 w-[250px]' onChange={(e)=>setReferenceId(e.target.value)} placeholder='Enter Reference Number'/>
                    <Button onClick={()=>trackBooking()} type='primary' className='bg-lime-600 mb-4 w-fit'>Track Booking</Button>
                    </div>
                    </div>
                </div>

            <div className='max-w-[1200px] mx-auto p-4'>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="lg:w-3/4">
                        <MarketIndex />
                    </div>
                    <div className="lg:w-1/4 bg-gray-50 text-black border-l p-4">
                    
                        <h2 className="text-xl border-b pb-2 mb-2">Track my booking</h2>
                        <Input className='mb-2' onChange={(e)=>setReferenceId(e.target.value)} placeholder='Enter Reference Number'/>
                        <Button onClick={()=>trackBooking()} block type='primary' className='bg-lime-600 mb-4 w-fit'>Track Booking</Button>

                        <div className="flex flex-col gap-4">
                            {[
                                { title: "Live Tobacco Market Index", description: "Get real-time updates on the current tobacco market prices.", icon: <HiTrendingUp size={32} /> },
                                { title: "Book Floor Space", description: "Easily book floor space for your tobacco sales.", icon: <HiCalendar size={32} /> },
                                { title: "Real-Time Notifications", description: "Receive instant notifications on your bookings and market changes.", icon: <HiBell size={32} /> },
                                { title: "Track Sales", description: "Monitor your sales performance and history.", icon: <HiChartPie size={32} /> },
                                { title: "Customer Support", description: "Get assistance with your bookings and sales queries.", icon: <HiSupport size={32} /> },
                                { title: "Data Analytics", description: "Analyze your sales data to make informed decisions.", icon: <HiChartBar size={32} /> },
                            ].map((feature, index) => (
                                <div key={index} className="flex border-b p-2 items-start gap-4">
                                    <div>{feature.icon}</div>
                                    <div>
                                        <h3 className="">{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export default Market;
