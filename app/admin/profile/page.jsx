"use client"
import React, { useEffect, useState } from 'react';
import pb from '@/lib/connection';

const Page = () => {
    const [user, setUser] = useState({});
    const [merchant, setMerchant] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            const userDetails = pb.authStore.model;
            setUser(userDetails);

            // Only fetch merchant details if the user is not an ADMIN
            if (userDetails?.id && userDetails?.role !== 'ADMIN') {
                try {
                    // Fetch the merchant details using the admin field
                    const merchantDetails = await pb.collection('merchants').getFirstListItem(`admin="${userDetails.id}"`);
                    setMerchant(merchantDetails);
                } catch (e) {
                    console.error("Failed to fetch merchant details", e.message);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <div className="bg-white overflow-hidden shadow rounded-lg border">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        User Profile
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Role: SUPER ADMIN.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Full name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.username}
                            </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.email}
                            </dd>
                        </div>
                        {user.role !== 'ADMIN' && merchant && (
                            <>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Merchant Name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {merchant.name}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Merchant Phone
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {merchant.phoneNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        City
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {merchant.city}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {merchant.address}
                                    </dd>
                                </div>
                            </>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default Page;
