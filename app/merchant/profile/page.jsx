"use client";
import React, { useEffect, useState } from "react";
import { Input, Button } from "antd"; // Ant Design components for input and buttons
import pb from "@/lib/connection";

const Page = () => {
    const [user, setUser] = useState({});
    const [merchant, setMerchant] = useState({});
    const [editingUser, setEditingUser] = useState(false);
    const [editingMerchant, setEditingMerchant] = useState(false);
    const [userChanges, setUserChanges] = useState({});
    const [merchantChanges, setMerchantChanges] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            const userDetails = pb.authStore.model;
            setUser(userDetails);

            if (userDetails?.id && userDetails.role !== "ADMIN") {
                try {
                    // Fetch the merchant details using the admin field
                    const merchantDetails = await pb.collection("merchants").getFirstListItem(`admin="${userDetails.id}"`);
                    setMerchant(merchantDetails);
                } catch (e) {
                    console.error("Failed to fetch merchant details", e.message);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleUserEditToggle = () => {
        setEditingUser(!editingUser);
        setUserChanges(user); // Set initial changes to current user state
    };

    const handleMerchantEditToggle = () => {
        setEditingMerchant(!editingMerchant);
        setMerchantChanges(merchant); // Set initial changes to current merchant state
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserChanges({ ...userChanges, [name]: value });
    };

    const handleMerchantChange = (e) => {
        const { name, value } = e.target;
        setMerchantChanges({ ...merchantChanges, [name]: value });
    };

    const saveUserChanges = async () => {
        try {
            await pb.collection("users").update(user.id, userChanges);
            setUser(userChanges);
            setEditingUser(false);
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    const saveMerchantChanges = async () => {
        try {
            await pb.collection("merchants").update(merchant.id, merchantChanges);
            setMerchant(merchantChanges);
            setEditingMerchant(false);
        } catch (error) {
            console.error("Error updating merchant details:", error);
        }
    };

    return (
        <div>
            <div className="bg-white overflow-hidden shadow rounded-lg border">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">This is some information about the user.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {editingUser ? (
                            <>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <Input name="username" value={userChanges.username} onChange={handleUserChange} />
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <Input name="email" value={userChanges.email} onChange={handleUserChange} />
                                    </dd>
                                </div>
                                <Button onClick={saveUserChanges} type="primary">Save</Button>
                                <Button onClick={handleUserEditToggle}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                                </div>
                                {user.role !== "ADMIN" && <Button onClick={handleUserEditToggle} className="m-2 bg-blue-400">Edit</Button>}
                            </>
                        )}
                        {user.role !== "ADMIN" && merchant && (
                            <>
                                {editingMerchant ? (
                                    <>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Merchant Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Input name="name" value={merchantChanges.name} onChange={handleMerchantChange} />
                                            </dd>
                                        </div>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Merchant Phone</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Input name="phoneNumber" value={merchantChanges.phoneNumber} onChange={handleMerchantChange} />
                                            </dd>
                                        </div>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">City</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Input name="city" value={merchantChanges.city} onChange={handleMerchantChange} />
                                            </dd>
                                        </div>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Input name="address" value={merchantChanges.address} onChange={handleMerchantChange} />
                                            </dd>
                                        </div>
                                        <Button onClick={saveMerchantChanges} type="primary">Save</Button>
                                        <Button onClick={handleMerchantEditToggle}>Cancel</Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Merchant Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{merchant.name}</dd>
                                        </div>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Merchant Phone</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{merchant.phoneNumber}</dd>
                                        </div>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">City</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{merchant.city}</dd>
                                        </div>
                                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{merchant.address}</dd>
                                        </div>
                                        <Button onClick={handleMerchantEditToggle} className="m-2 bg-blue-400">Edit</Button>
                                    </>
                                )}
                            </>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Page;

