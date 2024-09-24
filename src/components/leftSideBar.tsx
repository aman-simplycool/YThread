import React from 'react';
import PersonalTrending from './personalTrending'
import LeftSideBottomCard from './leftSideBottomCard'

const LeftSideBar = () => {
  return (
    <div className="ml-0 fixed top-4 w-80 h-screen p-3 bg-gray-900 overflow-y-auto space-y-3">
      {/* First Card: PersonalTrending */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md  overflow-y-auto">
        <PersonalTrending />
      </div>

      {/* Second Card: LeftSideBottomCard */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md  overflow-y-auto">
        <LeftSideBottomCard />
      </div>
    </div>
  )
}

export default LeftSideBar
