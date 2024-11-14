import React from 'react';
import TrendingYs from './trendingY';
import TopYUsers from './topYUsers';
import { ProfileIcon } from './ProfileIcon';

const RightSideBar = () => {
  return (
    <div className="mr-0 w-80 h-screen p-3 bg-gray-900 space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
          <div className="bg-gray-900 rounded-full p-1">
            <ProfileIcon/>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-5 h-[300px] overflow-y-auto shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg font-semibold text-gray-100 text-center mb-4 tracking-wider">Most Trending Y&apos;s</h2>
        <TrendingYs />
      </div>

      <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-lg p-6 h-[420px] overflow-y-auto shadow-2xl space-y-4">
        <h2 className="text-lg font-semibold text-gray-200 text-center mb-4 tracking-wider">Top Users</h2>
        <TopYUsers />
      </div>
    </div>
  );
};

export default RightSideBar;
