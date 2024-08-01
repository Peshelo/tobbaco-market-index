"use client"
import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message, Steps, theme } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import pb from '@/lib/connection'; // Make sure to import PocketBase

const App = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    emailVisibility: true,
    password: '',
    passwordConfirm: '',
    name: '',
    role: 'MERCHANT',
  });

  const [merchantData, setMerchantData] = useState({
    name: '',
    phoneNumber: '',
    admin: '',
    market: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in userData) {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setMerchantData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const userRecord = await pb.collection('users').create(userData);

      const finalMerchantData = {
        ...merchantData,
        admin: userRecord.id,
        name: userRecord.name
      };

      await pb.collection('merchants').create(finalMerchantData);

      message.success('Processing complete!');
    } catch (error) {
      message.error('Submission failed, please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Personal Details',
      content: (
        <div className='h-fit'>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input name="username" value={userData.username} onChange={handleInputChange} placeholder="Username" className='w-full my-2' />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid Email!' }
            ]}
          >
            <Input name="email" value={userData.email} onChange={handleInputChange} placeholder="Email" className='w-full my-2' />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password name="password" value={userData.password} onChange={handleInputChange} placeholder="Password" className='w-full my-2' />
          </Form.Item>
          <Form.Item
            name="passwordConfirm"
            rules={[
              { required: true, message: 'Please confirm your Password!' },
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
            <Input.Password name="passwordConfirm" value={userData.passwordConfirm} onChange={handleInputChange} placeholder="Confirm Password" className='w-full my-2' />
          </Form.Item>
        </div>
      )
    },
    {
      title: 'Merchant Details',
      content: (
        <div className='h-fit'>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your Name!' }]}
          >
            <Input name="name" value={merchantData.name} onChange={handleInputChange} placeholder="Name" className='w-full my-2' />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input name="phoneNumber" value={merchantData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" className='w-full my-2' />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Terms and Conditions',
      content: (
        <div className='h-fit'>
          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[{ required: true, message: 'You must accept the terms and conditions!' }]}
          >
            <Checkbox>I accept the terms and conditions</Checkbox>
          </Form.Item>
        </div>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <div className='bg-white p-4 flex flex-col justify-center'>
      <Link href="/" className="p-2 text-xl font-bold rounded-sm flex flex-col items-center gap-y-2">
        <Image className="rounded" alt='logo' src={'/assets/images/logo.png'} width={60} height={60} loading="lazy"/>
        <label className="text-sm text-gray-400">Tobacco Market Index</label>
      </Link>
      <h1 className='w-full my-2 font-semibold text-center'>MERCHANT ONBOARDING</h1>
      <Steps current={current} items={items} />
      <Form
        form={form}
        layout="vertical"
        className='container p-2 bg-gray-50 my-2 border-2 border-dashed rounded'
        onFinish={current === steps.length - 1 ? onFinish : next}
      >
        {steps[current].content}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {current > 0 && (
            <Button onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit" loading={loading}>
              Done
            </Button>
          )}
        </div>
      </Form>
      <label className='w-full text-center mt-4 p-2 text-gray-600'>Already have an account? <Link href={'/auth/sign-in'} className='text-green-600'>Login</Link></label>
    </div>
  );
};

export default App;
