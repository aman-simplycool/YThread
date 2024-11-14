'use client'
import HomepageThread from '@/components/homepageThread';
import LeftSideBar from '@/components/leftSideBar';
import RightSideBar from '@/components/rightSideBar';
import React from 'react';
import '../components/ui/banner.css'
const Page = () => {
  return (
    <div className="flex w-full h-full flex-col  bg-gray-900">
      {/* Elegant Banner at the top */}
      <div className="w-full h-72 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-white shadow-lg border-b border-gray-700">

        <h1 className="text-4xl font-semibold tracking-wide text-gray-100 animate-glow animate-breathe">
          Welcome to Ythreads,<br/>
          Big Questions, Simple Choices..
        </h1>
      </div>
      
      {/* Main content section */}
      <div className="flex w-full flex-1 overflow-hidden">
        {/* core section starts */}
        <div className="w-1/5">
          <LeftSideBar />
        </div>
        <div className="w-3/5">
          <HomepageThread />
        </div>
        <div className="w-1/5">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};
export default Page;
