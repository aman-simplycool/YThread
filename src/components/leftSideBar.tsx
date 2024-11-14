import React from 'react';
import PersonalTrending from './personalTrending';
import LeftSideBottomCard from './leftSideBottomCard';

const LeftSideBar = () => {
  return (
    <div className="w-80 h-screen p-4 bg-gradient-to-b from-black via-gray-900 to-black shadow-xl space-y-4 border-r border-gray-800">
      {/* First Card: PersonalTrending */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-5 h-[300px] overflow-y-auto shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg font-semibold text-gray-100 text-center mb-4 tracking-wider">Your Trending Y&apos;s</h2>
        <PersonalTrending />
      </div>
  
      {/* Second Card: LeftSideBottomCard */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-5 h-[500px] overflow-y-auto shadow-md hover:shadow-lg transition-shadow duration-300">
        <LeftSideBottomCard />
      </div>
    </div>
  );
}

export default LeftSideBar;
