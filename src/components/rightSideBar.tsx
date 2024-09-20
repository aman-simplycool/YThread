import React from 'react';

import TrendingYs from './trendingY';
import TopYUsers from './topYUsers';
import ProfileIcon from './ProfileIcon';

const RightSideBar = () => {
  return (
    <div className="fixed right-0 top-4 w-80 mr-8 h-screen bg-[#475569] p-4 space-y-6 overflow-y-auto shadow-lg">

      <div className="">
        <ProfileIcon />
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md  overflow-y-auto">
        <TrendingYs />
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md  overflow-y-auto">
        <TopYUsers/>
      </div>
    </div>
  );
};

export default RightSideBar;
