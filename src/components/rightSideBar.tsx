import React from 'react';

import TrendingYs from './trendingY';
import TopYUsers from './topYUsers';
import { ProfileIcon } from './ProfileIcon';

const RightSideBar = () => {
  return (
    <div className="mr-0 fixed top-4 w-80 h-screen p-3 bg-gray-900 overflow-y-auto space-y-6">

      <div className="flex justify-center">
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
