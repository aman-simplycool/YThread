'use client';
import HomepageThread from '@/components/homepageThread';
import LeftSideBar from '@/components/leftSideBar';
import RightSideBar from '@/components/rightSideBar';
import React, { useEffect, useRef, useState } from 'react';
const Page = () => {

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/5">
        <LeftSideBar />
      </div>
      <div className="w-3/5 p-4 overflow-y-auto">
        <HomepageThread />
      </div>
      <div className="w-1/5">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Page;