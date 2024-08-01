"use client"
import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Table, Tag } from 'antd';
import pb from '@/lib/connection';
import { toast } from 'react-toastify';

const CalculatedMarket = ({ totalBaleKgs, grade }) => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(null); // State to store selected merchant details
    const [form] = Form.useForm();
    const [currentTotalBaleKgs, setCurrentTotalBaleKgs] = useState(totalBaleKgs);
    const [currentGrade, setCurrentGrade] = useState(grade);

    useEffect(() => {
        setCurrentTotalBaleKgs(totalBaleKgs);
        setCurrentGrade(grade);
    }, [totalBaleKgs, grade]);

    const showDrawer = (merchant) => {
        setSelectedMerchant(merchant); // Set the selected merchant details
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };

    const fetchMarketIndex = async () => {
        setLoading(true);
        try {
            const response = await pb.collection('merchants').getList(1, 50, {
                sort: '-updated',
            });
            setDataSource(response.items);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketIndex();
    }, []);

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
    };

    const formatChange = (change) => {
        if (change === 0) {
            return null; // Don't show Tag if change is zero
        }
        const formattedChange = parseFloat(change).toFixed(2);
        return (
            <Tag color={change >= 0 ? 'green' : 'red'}>
                {change >= 0 ? `+${formattedChange}%` : `${formattedChange}%`}
            </Tag>
        );
    };

    const onFinish = async (values) => {
        try {
            const record = await pb.collection('bookings').create({
                "merchant": selectedMerchant.id, // Use the selected merchant ID
                "firstName": values.firstName,
                "lastName": values.lastName,
                "phoneNumber": values.phoneNumber,
                "date": values.date.toISOString(),
                "status": "PENDING",
                "message": "Booking request",
                "email": values?.email,
                "nationalId": values?.nationalId // You may want to replace this with a dynamic value or add a new input for the message
            });
            toast.success('Booking created successfully!');
            alert("You booking reference no. is: " + record.id)
            onClose();
        } catch (error) {
            console.error('Failed to create booking:', error);
            toast.error('Failed to create booking.');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            fixed: 'left',
            render: (text) => <Tag color='blue'>{text}</Tag>,
        },
        {
            title: `Grade ${currentGrade} (USD)`,
            dataIndex: `grade_${currentGrade}_USD`,
            key: `grade_${currentGrade}_USD`,
            sorter: (a, b) => a.name.localeCompare(b.name),

            render: (text) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {parseFloat(formatPrice(text)) * parseFloat(currentTotalBaleKgs)}
                </label>
            ),
        },
        {
            title: `Grade ${currentGrade} (ZWL)`,
            dataIndex: `grade_${currentGrade}_ZWL`,
            key: `grade_${currentGrade}_ZWL`,
            sorter: (a, b) => a.name.localeCompare(b.name),

            render: (text) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {parseFloat(formatPrice(text)) * parseFloat(currentTotalBaleKgs)}
                </label>
            ),
        },
        {
            title: 'Last Update',
            dataIndex: 'updated',
            key: 'updated',
            render: (text) => <Tag color='green'>{text.slice(0, 10)}</Tag>,
            sorter: (a, b) => new Date(a.updated) - new Date(b.updated),
        },
    ];

    return (
        <div className='my-4'>
            <h1 className='text-xl'>Calculated payouts</h1>
            <label className='my-2 flex flex-row items-center gap-x-2 text-gray-500'>
                Total Weight: {currentTotalBaleKgs}kgs  <Tag>Grade: {currentGrade}</Tag>
            </label>
            <div className="w-full">
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ x: '100%' }}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </div>
    );
}

export default CalculatedMarket;
