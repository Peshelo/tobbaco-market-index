"use client"
import pb from '@/lib/connection';
import { Button, Table, Tag } from 'antd';
import{ useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
    const [loading,setLoading] = useState(false)
const [bookings,setBookings] = useState([])

const fetchBookings = async ()=>{
    setLoading(true)
    try{
        const records = await pb.collection('bookings').getFullList({
            sort: '-created',
        });
        setBookings(records);
        console.log(records)
    }catch(e){
        console.log("Failed to fetch",e.message)
    }finally{
        setLoading(false)
    }
}

const approve = async (record,status)=>{
try{
    const data = {
        "merchant": record?.merchant,
        "firstName": record?.firstName,
        "lastName": record?.lastName,
        "phoneNumber": record?.phoneNumber,
        "date": record?.date,
        "status": status,
        "message": "You booking has been "+status.toLowerCase(),
          "email": record?.email,
    "nationalId": record?.nationalId
    };
    const response = await pb.collection('bookings').update(record.id, data);
    toast.success('Record has been '+status.toLowerCase())
}catch(e){
    toast.error(e.message)
}finally{
    fetchBookings();
}
}

const columns = [
    {
        title: 'Ref Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.name.localeCompare(b.name),
        fixed: 'left'
    },
    {
        title: 'FirstName',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.name.localeCompare(b.name),
    }
    ,
    {
        title: 'LastName',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'NationalID',
        dataIndex: 'nationalId',
        key: 'nationalId',
        sorter: (a, b) => a.name.localeCompare(b.name),
    }
    
    ,
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.name.localeCompare(b.name),
    }
    ,
    {
        title: 'PhoneNumber',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        sorter: (a, b) => a.name.localeCompare(b.name),
    }
    ,
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text) => <Tag className='' color='blue'>{text}</Tag>
    },
    {
        title: 'Actions',
        dataIndex: 'id',
        key: 'actions',
        render: (text, item) => <div className='flex flex-row items-center'>
        <Button onClick={() => approve(item,"REJECTED")} type='primary' className='bg-red-600 text-white'>Disapprove</Button>,
        <Button onClick={() => approve(item,"BOOKED")} type='primary'>Approve</Button>,

        </div>,
         // Pass merchant details
        fixed: 'right',
    },
]

useEffect(() => {
    fetchBookings();
    console.log(bookings)
}, []);

    return (
        <div>
            <h1>Bookings</h1>
            <Table
                loading={loading}
                dataSource={bookings}
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => (
                        <p>{`Message: ${record.message}`}</p>
                    ),
                    rowExpandable: (record) => record.id,
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}

export default Page;
