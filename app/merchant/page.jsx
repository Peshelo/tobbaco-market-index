"use client"
import React, { useEffect, useState } from 'react';
import { Button, Input, Drawer, Form, Divider } from 'antd';
import { CiEdit } from "react-icons/ci";
import StatsCard from '@/components/statsCard';
import pb from '@/lib/connection';
import { toast } from 'react-toastify';

const Page = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const record = await pb.collection('merchants').getFirstListItem(`admin="${pb.authStore.model.id}"`, {
                expand: 'admin',
            });
            setData(record);
            console.log(record);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const handleUpdate = async (values) => {
        const updates = {};
        const changes = {};

        for (const key in values) {
            updates[key] = parseFloat(values[key]);
            if (!isNaN(updates[key]) && data) {
                changes[`${key}_change`] = ((updates[key] - data[key]) / data[key]) * 100; // Calculate percentage change
            }
        }

        try {
            await pb.collection('merchants').update(data.id, { ...updates, ...changes });
            setOpen(false);
            fetchStatistics(); // Refresh data after update
            toast.success('Statistics updated successfully');
        } catch (error) {
            console.error('Error updating statistics:', error);
            toast.error('Failed to update statistics');
        }
    };

    return (
        <div>
            <h1 className='my-2 text-2xl'>Statistics</h1>
            {data && (
                <div className="w-full grid grid-cols-3 max-md:grid-cols-1 gap-2">
                    <StatsCard value_USD={data.grade_A_USD} value_ZWL={data.grade_A_ZWL} grade={'A'} suffix={'USD'} />
                    <StatsCard value_USD={data.grade_B_USD} value_ZWL={data.grade_B_ZWL} grade={'B'} suffix={'USD'} />
                    <StatsCard value_USD={data.grade_C_USD} value_ZWL={data.grade_C_ZWL} grade={'C'} suffix={'USD'} />
                </div>
            )}
            <Divider><Button onClick={() => setOpen(true)} type='link'><CiEdit size={19} />Update Statistics</Button></Divider>

            <Drawer
                title="Update Statistics"
                visible={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={600}
            >
                <Form
                    layout="vertical"
                    initialValues={data}
                    onFinish={handleUpdate}
                >
                    <Divider>GRADE A</Divider>
                    <div className=' flex flex-row w-full items-center gap-x-2 justify-between max-md:flex-col max-md:gap-y-2'>
                        <Form.Item
                            name="grade_A_USD"
                            label="Grade A (USD)"
                            style={{ width: '100%' }}
                            rules={[{ required: true, message: 'Please enter Grade A (USD)' }]}
                        >
                            <Input size='large' placeholder="Enter Grade A (USD)" />
                        </Form.Item>
                        <Form.Item
                            name="grade_A_ZWL"
                            label="Grade A (ZWL)"
                            style={{ width: '100%' }}
                            rules={[{ required: true, message: 'Please enter Grade A (ZWL)' }]}
                        >
                            <Input size='large' placeholder="Enter Grade A (ZWL)" />
                        </Form.Item>
                    </div>
                    <Divider>GRADE B</Divider>
                    <div className=' flex flex-row w-full items-center gap-x-2 justify-between max-md:flex-col max-md:gap-y-2'>
                        <Form.Item
                            name="grade_B_USD"
                            label="Grade B (USD)"
                            style={{ width: '100%' }}
                            rules={[{ required: true, message: 'Please enter Grade B (USD)' }]}
                        >
                            <Input size='large' placeholder="Enter Grade B (USD)" />
                        </Form.Item>
                        <Form.Item
                            name="grade_B_ZWL"
                            label="Grade B (ZWL)"
                            style={{ width: '100%' }}
                            rules={[{ required: true, message: 'Please enter Grade B (ZWL)' }]}
                        >
                            <Input size='large' placeholder="Enter Grade B (ZWL)" />
                        </Form.Item>
                    </div>
                    <Divider>GRADE C</Divider>
                    <div className=' flex flex-row w-full items-center gap-x-2 justify-between max-md:flex-col max-md:gap-y-2'>
                        <Form.Item
                            name="grade_C_USD"
                            label="Grade C (USD)"
                            style={{ width: '100%' }}
                            rules={[{ required: true, message: 'Please enter Grade C (USD)' }]}
                        >
                            <Input size='large' placeholder="Enter Grade C (USD)" />
                        </Form.Item>
                        <Form.Item
                            name="grade_C_ZWL"
                            label="Grade C (ZWL)"
                            style={{ width: '100%' }}
                            rules={[{ required: true, message: 'Please enter Grade C (ZWL)' }]}
                        >
                            <Input size='large' placeholder="Enter Grade C (ZWL)" />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button size='large' type="primary" htmlType="submit">
                            Update
                        </Button>
                        <Button size='large' onClick={() => setOpen(false)} style={{ marginLeft: '10px' }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Page;
