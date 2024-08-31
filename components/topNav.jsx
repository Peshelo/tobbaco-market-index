import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const TopNav = () => {
    return (
        <div className="w-full top-0 sticky text-sm bg-white z-50 p-2 text-green-700 border-b flex flex-row items-center justify-between">
          <div className='w-[1200px] mx-auto flex flex-row gap-x-4 justify-between items-center'>
          <Link href={'/'} className="font-bold flex flex-row items-center gap-x-1"><Image className="rounded" alt='logo' src={'/assets/images/logo.png'} width={40} height={40} loading="lazy"/>Tobbaco Market Index</Link>
        <ul className="flex flex-row gap-x-2 items-center">
        {/* <li className='text-gray-700 hover:to-green-500 max-md:hidden'><Link href={'/'} className='px-2'>Home</Link></li> */}
        <li className='text-gray-700 hover:to-green-500 max-md:hidden'><Link href={'/market'} className='px-2'>Market</Link></li>
        <li className='text-gray-700 hover:to-green-500 max-md:hidden'><Link href={'/market/calculator'} className='px-2'>Calculator</Link></li>

      </ul>
        <ul className="flex flex-row gap-x-2 items-center">
            </ul>
            <ul className="flex flex-row gap-x-2 items-center">
              {/* <li><Link href={'/auth/sign-in'}>Login</Link></li> */}
              <li><Link href={'/auth/sign-in'} className="bg-green-700 p-2 rounded-md text-white">Login</Link></li>
            </ul>
          </div>
        
          </div>
    );
}

export default TopNav;
