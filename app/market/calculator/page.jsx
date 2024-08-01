"use client"
import React, { useState } from 'react';
import BottomNav from '@/components/bottomNav';
import MarketIndex from '@/components/marketIndex';
import TopNav from '@/components/topNav';
import { Button, Col, Divider, Input, Modal, Row, Select, Tag, Typography, Space } from 'antd';
import { HiTrendingUp, HiCalendar, HiBell, HiChartPie, HiSupport, HiChartBar } from 'react-icons/hi';
import { toast } from 'react-toastify';
import pb from '@/lib/connection';
import CalculatedMarket from '@/components/calculatedMarket';

const { Title, Text } = Typography;

const Market = () => {
    const [referenceId, setReferenceId] = useState();
    const [isOpen, setIsOpen] = useState();
    const [myBooking, setMyBooking] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalBaleKgs, setTotalBaleKgs] = useState(1);
    const [grade, setGrade] = useState('A');
    
    // Temporary state variables
    const [tempTotalBaleKgs, setTempTotalBaleKgs] = useState(1);
    const [tempGrade, setTempGrade] = useState('A');

    const calculate = () => {
        setTotalBaleKgs(tempTotalBaleKgs);
        setGrade(tempGrade);
        // Add any other logic needed for the calculation
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <TopNav />
            <div className="relative w-full h-[300px] text-white bg-no-repeat bg-cover" style={{ backgroundImage: 'url(/assets/images/market.jpg)' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-blue-600 opacity-70"></div>

                <div className="max-w-[1200px] relative h-full flex flex-col justify-center mx-auto px-4">
                    <Title style={{color:'white'}} level={1} className="text-white">Market Yield Calculator</Title>
                    <Text className="text-lg text-gray-200 mb-2">Calculate profits across various floors in one place</Text>
                    <div className='flex flex-col md:flex-row gap-2 items-center'>
                        <Input 
                            className='mb-2 md:mb-0 w-full md:w-[250px]' 
                            size='large' 
                            type='number'
                            min={1} 
                            onChange={(e) => setTempTotalBaleKgs(parseFloat(e.target.value) || 1)} 
                            placeholder='Enter total bale kgs'
                        />
                        <Select 
                            className='mb-2 md:mb-0 w-full md:w-[250px]' 
                            size='large' 
                            placeholder='Select grade'
                            onChange={(value) => setTempGrade(value)}
                            value={tempGrade}
                        >
                            <Select.Option value="A">A</Select.Option>
                            <Select.Option value="B">B</Select.Option>
                            <Select.Option value="C">C</Select.Option>
                        </Select>

                        <Button onClick={calculate} type='primary' className='bg-blue-600' size='large'>Calculate</Button>
                    </div>
                </div>
            </div>

            <div className='max-w-[1200px] mx-auto p-4'>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full">
                        <CalculatedMarket totalBaleKgs={totalBaleKgs} grade={grade}/>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export default Market;
