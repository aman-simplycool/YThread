import React from 'react'
import PersonalTrending from './personalTrending'
import LeftSideBottomCard from './leftSideBottomCard'

const LeftSideBar = () => {
  return (
    <div className="fixed left-0 top-4 w-80 mr-8 h-screen bg-[#475569] p-4 space-y-6 overflow-y-auto shadow-lg">
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
