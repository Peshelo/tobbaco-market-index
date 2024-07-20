"use client";
import React from 'react';
import { Button, Col, Divider, Row, Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

const StatsCard = ({value_USD,value_ZWL,precision,suffix,grade,loading}) => (
    
    
    <div className='bg-white p-4 w-full border rounded-md'>
      <Statistic loading={loading} title={`Tobbaco Grade ${grade}`} value={value_USD} precision={precision} suffix={'USD'} />
      <Divider dashed/>
      <Statistic  value={value_ZWL} 
      precision={precision} suffix={'ZWL'} />
      {/* <Button
        block
        type="link"
      >
        Update
      </Button> */}
    </div>
);
export default StatsCard;