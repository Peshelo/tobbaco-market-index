"use client";
import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Drawer, Form, InputNumber, Tag, message, Popconfirm, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PocketBase from 'pocketbase';
import pb from '@/lib/connection';
import Link from 'next/link';

const MerchantsPage = () => {
    const [merchants, setMerchants] = useState([]);
    const [expandedMerchant, setExpandedMerchant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchMerchants();
    }, [searchTerm]);

    const fetchMerchants = async () => {
        setLoading(true);
        try {
            const filter = {};
            if (searchTerm) {
                filter.search = searchTerm;
            }
            const result = await pb.collection('merchants').getList(1, 50, filter);
            setMerchants(result.items);
        } catch (error) {
            message.error('Failed to fetch merchants');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (isActive) => {
        setIsActiveFilter(isActive);
    };

    const showDrawer = (isEditMode, merchant = null) => {
        setIsEdit(isEditMode);
        setSelectedMerchant(merchant);
        if (isEditMode && merchant) {
            form.setFieldsValue(merchant);
        }
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        form.resetFields();
    };

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            if (isEdit) {
                await pb.collection('merchants').update(selectedMerchant.id, values);
                message.success('Merchant updated successfully');
            } else {
                await pb.collection('merchants').create(values);
                message.success('Merchant added successfully');
            }
            closeDrawer();
            fetchMerchants(); // Refresh the merchants list
        } catch (error) {
            message.error('Failed to submit');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await pb.collection('merchants').delete(id);
            message.success('Merchant deleted successfully');
            fetchMerchants(); // Refresh the merchants list
        } catch (error) {
            message.error('Failed to delete merchant');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminDetails = async (merchantId, adminId) => {
        try {
            const admin = await pb.collection('users').getOne(adminId);
            setExpandedMerchant({ id: merchantId, admin });
        } catch (error) {
            console.error(`Failed to fetch admin details for merchant ID: ${merchantId}`, error);
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.isActive === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div className="flex space-x-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showDrawer(true, record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this merchant?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Input
                    placeholder="Search merchants"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-1/3"
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer(false)}>
                    Add Merchant
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={merchants}
                    columns={columns}
                    rowKey="id"
                    expandable={{
                        expandedRowRender: (record) => (
                            <div>
                                {expandedMerchant && expandedMerchant.id === record.id ? (
                                    <div>
                                        <p>Admin Name: {expandedMerchant.admin?.name}</p>
                                        <p>Admin Email: {expandedMerchant.admin?.email}</p>
                                        <p>Admin Role: {expandedMerchant.admin?.role}</p>
                                    </div>
                                ) : (
                                    'Loading admin details...'
                                )}
                            </div>
                        ),
                        onExpand: (expanded, record) => {
                            if (expanded) {
                                fetchAdminDetails(record.id, record.admin);
                            }
                        },
                    }}
                />
            )}

            <Drawer
                title={isEdit ? "Edit Merchant" : "Add New Merchant"}
                width={480}
                onClose={closeDrawer}
                open={isDrawerOpen}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the merchant name' }]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter the phone number' }]}
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                    <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'Please enter the city' }]}
                    >
                        <Input placeholder="Enter city" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please enter the address' }]}
                    >
                        <Input placeholder="Enter address" />
                    </Form.Item>
                    <Form.Item
                        name="isActive"
                        label="Active Status"
                        valuePropName="checked"
                    >
                        <Input type="checkbox" />
                    </Form.Item>
                    {/* Add more fields as necessary */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default MerchantsPage;
