"use client";
import React, { useState } from 'react';
import pb from '@/lib/connection'; // Ensure PocketBase is correctly imported
import { Button, Form, Input, InputNumber, Select, Spin, Row, Col, message } from 'antd';

const { Option } = Select;

// List of cities in Zimbabwe (for example purposes, this list can be updated)
const cities = [
    "Harare",
    "Bulawayo",
    "Chitungwiza",
    "Mutare",
    "Gweru",
    "Kwekwe",
    "Kadoma",
    "Masvingo",
    "Epworth",
    "Zvishavane",
    // Add more cities as needed
];

const Page = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Create user record
            const userRecord = await pb.collection('users').create({
                username: values.username,
                email: values.email,
                emailVisibility: true,
                password: values.password,
                passwordConfirm: values.passwordConfirm,
                name: values.name,
                role: 'MERCHANT',
            });

            // Prepare merchant data
            const merchantData = {
                name: values.name,
                phoneNumber: values.phoneNumber,
                admin: userRecord.id,
                city: values.city, // City dropdown value
                address: values.address,
                isActive: true, // Set default value
                grade_A_USD: 0, // Set default value
                grade_A_USD_change: 0, // Set default value
                grade_A_ZWL: 0, // Set default value
                grade_A_ZWL_change: 0, // Set default value
                grade_B_USD: 0, // Set default value
                grade_B_USD_change: 0, // Set default value
                grade_B_ZWL: 0, // Set default value
                grade_B_ZWL_change: 0, // Set default value
                grade_C_USD: 0, // Set default value
                grade_C_USD_change: 0, // Set default value
                grade_C_ZWL: 0, // Set default value
                grade_C_ZWL_change: 0, // Set default value
                process: 0, // Set default value
            };

            // Create merchant record
            await pb.collection('merchants').create(merchantData);

            message.success('Merchant added successfully!');
            form.resetFields();
        } catch (error) {
            message.error('Submission failed, please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4'>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className='bg-white p-4 border border-gray-300 rounded shadow-md'
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please input the Username!' }]}
                        >
                            <Input placeholder="Username" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please input the Email!' },
                                { type: 'email', message: 'Please enter a valid Email!' }
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input the Password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="passwordConfirm"
                            label="Confirm Password"
                            rules={[
                                { required: true, message: 'Please confirm the Password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input the Name!' }]}
                        >
                            <Input placeholder="Name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please input the Phone Number!' }]}
                        >
                            <Input placeholder="Phone Number" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="city"
                            label="City"
                            rules={[{ required: true, message: 'Please select the City!' }]}
                        >
                            <Select placeholder="Select a city">
                                {cities.map((city) => (
                                    <Option key={city} value={city}>
                                        {city}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please input the Address!' }]}
                        >
                            <Input placeholder="Address" />
                        </Form.Item>
                    </Col>
                </Row>
                <div className='flex justify-end'>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {loading ? <Spin /> : 'Submit'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Page;
