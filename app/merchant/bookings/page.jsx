"use client"
import pb from '@/lib/connection';
import { Button, Table, Tag, DatePicker, Input, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [searchDate, setSearchDate] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [searchNationalId, setSearchNationalId] = useState('');

    const fetchBookings = async (filters = {}) => {
        setLoading(true);
        try {
            const filterConditions = [];
            if (filters.date) {
                filterConditions.push(`date="${filters.date}"`);
            }
            if (filters.id) {
                filterConditions.push(`id="${filters.id}"`);
            }
            if (filters.nationalId) {
                filterConditions.push(`nationalId="${filters.nationalId}"`);
            }
            const filterString = filterConditions.length ? filterConditions.join(' && ') : null;
            const records = await pb.collection('bookings').getFullList({
                filter: filterString,
                sort: '-created',
            });
            setBookings(records);
        } catch (e) {
            console.log("Failed to fetch", e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingsByDate = async (date) => {
        try {
            const records = await pb.collection('bookings').getFullList({
                filter: `date="${date}"`,
                sort: 'created',
            });
            return records;
        } catch (e) {
            console.log("Failed to fetch by date", e.message);
            return [];
        }
    };

    const updateLineNumbers = async (date) => {
        const records = await fetchBookingsByDate(date);
        const filteredRecords = records.filter(r => r.lineNumber > 0);
        for (let i = 0; i < filteredRecords.length; i++) {
            const record = filteredRecords[i];
            await pb.collection('bookings').update(record.id, { lineNumber: i + 1 });
        }
    };

    const approve = async (record, status) => {
        try {
            let data = {
                "merchant": record?.merchant,
                "firstName": record?.firstName,
                "lastName": record?.lastName,
                "phoneNumber": record?.phoneNumber,
                "date": record?.date,
                "status": status,
                "message": "Your booking has been " + status.toLowerCase(),
                "email": record?.email,
                "nationalId": record?.nationalId,
            };

            if (status === "BOOKED") {
                const recordsByDate = await fetchBookingsByDate(record.date);
                const filteredRecords = recordsByDate.filter(r => r.lineNumber > 0);
                data.lineNumber = filteredRecords.length + 1;
            }

            const response = await pb.collection('bookings').update(record.id, data);
            toast.success('Record has been ' + status.toLowerCase());

            if (status === "REJECTED" && record.lineNumber > 0) {
                await pb.collection('bookings').update(record.id, { lineNumber: 0 });
                await updateLineNumbers(record.date);
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            fetchBookings({
                date: searchDate ? dayjs(searchDate).format('YYYY-MM-DD') : null,
                id: searchId,
                nationalId: searchNationalId,
            });
        }
    };

    const handleSearch = () => {
        fetchBookings({
            date: searchDate ? dayjs(searchDate).format('YYYY-MM-DD') : null,
            id: searchId,
            nationalId: searchNationalId,
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'BOOKED':
                return 'green';
            case 'REJECTED':
                return 'red';
            default:
                return 'blue';
        }
    };

    const columns = [
        {
            title: 'Ref Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            fixed: 'left'
        },
        {
            title: 'FirstName',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        },
        {
            title: 'LastName',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        },
        {
            title: 'NationalID',
            dataIndex: 'nationalId',
            key: 'nationalId',
            sorter: (a, b) => a.nationalId.localeCompare(b.nationalId),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'PhoneNumber',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
        },
        {
            title: 'Line Number',
            dataIndex: 'lineNumber',
            key: 'lineNumber',
            sorter: (a, b) => a.lineNumber - b.lineNumber,
            render: (text)=><labe>{text == 0 ? '---' : text}</labe>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (text) => <Tag color={getStatusColor(text)}>{text}</Tag>
        },
        {
            title: 'Date booked',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <Tag color='green'>{text.slice(0, 10)}</Tag>,
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            key: 'actions',
            render: (text, item) => (
                <div className='flex flex-row items-center'>
                    {item.status !== 'BOOKED' && (
                        <Button onClick={() => approve(item, "BOOKED")} type='primary'>Approve</Button>
                    )}
                    {item.status !== 'REJECTED' && (
                        <Button onClick={() => approve(item, "REJECTED")} type='primary' className='bg-red-600 text-white'>Disapprove</Button>
                    )}
                </div>
            ),
            fixed: 'right',
        },
    ];

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div>
            <h1>Bookings</h1>
            <div className="mb-4">
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <DatePicker 
                            onChange={(date) => setSearchDate(date)} 
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Search by ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Search by National ID"
                            value={searchNationalId}
                            onChange={(e) => setSearchNationalId(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button 
                            onClick={handleSearch} 
                            type="primary" 
                            style={{ width: '100%' }}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
            </div>
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
