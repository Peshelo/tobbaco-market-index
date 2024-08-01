"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { HiCalculator, HiChartBar, HiHome, HiMiniCog6Tooth } from 'react-icons/hi2';

const BottomNav = () => {
    const pathname = usePathname().toString();

    const linkStyle = "w-full flex flex-col items-center justify-center gap-y-2 tex-xs";
    const activeLinkStyle = "w-full flex flex-col items-center justify-center text-green-700 gap-y-2 tex-xs border-t-[4px] p-2 border-green-700";

    return (
        <div className="fixed bottom-0 z-50 w-full bg-white border-t-2 text-gray-700 px-4 pb-2 flex flex-row items-center justify-between lg:hidden">
            <Link href={'/'} className={pathname === '/' ? activeLinkStyle : linkStyle}>
                    <HiHome size={25} />
                    <label className="text-sm">Home</label>
            </Link>
            <Link href={'/market'} className={pathname === '/market' ? activeLinkStyle : linkStyle}>
                    <HiChartBar size={25} />
                    <label className="text-sm text-gray-700">Market</label>
            </Link>
            <Link href={'/market/calculator'} className={pathname === '/market/calculator' ? activeLinkStyle : linkStyle}>
                    <HiCalculator size={25} />
                    <label className="text-sm text-gray-700">Calculator</label>
            </Link>
        </div>
    );
}

export default BottomNav;
