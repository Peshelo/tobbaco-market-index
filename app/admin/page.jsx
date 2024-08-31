"use client";
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, Typography } from 'antd';
import PocketBase from 'pocketbase';
import pb from '@/lib/connection';

const { Title } = Typography;

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalMerchants: null,
        totalActiveMerchants: null,
        totalInactiveMerchants: null,
        totalBookings: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch total merchants
                const merchantsResponse = await pb.collection('merchants').getList();
                const totalMerchants = merchantsResponse.totalItems;

                // Fetch active merchants
                const activeMerchantsResponse = await pb.collection('merchants').getList(1, 100, { filter: 'isActive = true' });
                const totalActiveMerchants = activeMerchantsResponse.totalItems;

                // Fetch inactive merchants
                const inactiveMerchantsResponse = await pb.collection('merchants').getList(1, 100, { filter: 'isActive = false' });
                const totalInactiveMerchants = inactiveMerchantsResponse.totalItems;

                // Fetch total bookings
                const bookingsResponse = await pb.collection('bookings').getList();
                const totalBookings = bookingsResponse.totalItems;

                // Update state
                setData({
                    totalMerchants,
                    totalActiveMerchants,
                    totalInactiveMerchants,
                    totalBookings,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='p-4'>
            <Title level={2} className='mb-4'>Dashboard</Title>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={16}>
                    <Col span={6}>
                        <Card title="Total Merchants" bordered={false}>
                            <Title level={3}>{data.totalMerchants}</Title>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Total Active Merchants" bordered={false}>
                            <Title level={3}>{data.totalActiveMerchants}</Title>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Total Inactive Merchants" bordered={false}>
                            <Title level={3}>{data.totalInactiveMerchants}</Title>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Total Bookings" bordered={false}>
                            <Title level={3}>{data.totalBookings}</Title>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default DashboardPage;
