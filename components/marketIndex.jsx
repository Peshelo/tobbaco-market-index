"use client"
import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Table, Tag } from 'antd';
import pb from '@/lib/connection';
import { toast } from 'react-toastify';

const MarketIndex = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(null); // State to store selected merchant details
    const [form] = Form.useForm();

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
            render: (text) => <Tag color='volcano'>{text}</Tag>,
        },
        {
            title: 'Grade A (USD)',
            dataIndex: 'grade_A_USD',
            key: 'grade_A_USD',
            render: (text, record) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {formatPrice(text)} {formatChange(record.grade_A_USD_change)}
                </label>
            ),
        },
        {
            title: 'Grade A (ZWL)',
            dataIndex: 'grade_A_ZWL',
            key: 'grade_A_ZWL',
            render: (text, record) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {formatPrice(text)} {formatChange(record.grade_A_ZWL_change)}
                </label>
            ),
        },
        {
            title: 'Grade B (USD)',
            dataIndex: 'grade_B_USD',
            key: 'grade_B_USD',
            render: (text, record) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {formatPrice(text)} {formatChange(record.grade_B_USD_change)}
                </label>
            ),
        },
        {
            title: 'Grade B (ZWL)',
            dataIndex: 'grade_B_ZWL',
            key: 'grade_B_ZWL',
            render: (text, record) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {formatPrice(text)} {formatChange(record.grade_B_ZWL_change)}
                </label>
            ),
        },
        {
            title: 'Grade C (USD)',
            dataIndex: 'grade_C_USD',
            key: 'grade_C_USD',
            render: (text, record) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {formatPrice(text)} {formatChange(record.grade_C_USD_change)}
                </label>
            ),
        },
        {
            title: 'Grade C (ZWL)',
            dataIndex: 'grade_C_ZWL',
            key: 'grade_C_ZWL',
            render: (text, record) => (
                <label className='flex flex-row items-center gap-x-1'>
                    {formatPrice(text)} {formatChange(record.grade_C_ZWL_change)}
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
        {
            title: 'Actions',
            dataIndex: 'id',
            key: 'actions',
            render: (text, item) => <Button onClick={() => showDrawer(item)} type='primary'>Book</Button>, // Pass merchant details
            fixed: 'right',
        },
    ];

    return (
        <div className='my-4'>
            <Drawer title={`Company: ${selectedMerchant?.name}`} onClose={onClose} open={open} width={720}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <p className='mb-4 text-md font-semibold'>Fill form below to book.</p>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Please enter email' }]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter phone number' }]}
                            >
                                <Input addonBefore="+264" placeholder="Phone Number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                        <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Please select date' }]}
                    >
                        <DatePicker className='w-full' showTime />
                    </Form.Item>
                        </Col>
                        <Col span={12}>
                        <Form.Item
                                name="nationalId"
                                label="NationalId"
                                rules={[{ required: true, message: 'Please enter national Id' }]}
                            >
                                <Input placeholder="NationalId" />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Button type="primary" className='bg-lime-700' htmlType="submit" block>Book</Button>
                </Form>
            </Drawer>
            <h1 className='text-xl'><span className='text-gray-400'>|</span> Market Index</h1>
            <Table
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => (
                        <p>{`Phone: ${record.name} Phone: ${record.phoneNumber}`}</p>
                    ),
                    rowExpandable: (record) => record.id,
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}

export default MarketIndex;
