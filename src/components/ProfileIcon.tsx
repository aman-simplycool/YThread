'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaUser } from "react-icons/fa";

function ProfileIcon() {
  const router = useRouter();
  const {data:session,status} = useSession();

  const handleLogout = async () => {

    await signOut({ callbackUrl: '/' }); 

  };

  return (
    <div className="flex items-center justify-center" onClick={handleLogout}>
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-800">
          <FaUser className="text-white w-10 h-10" />
      </div>
    </div>
  );
}

export default ProfileIcon;
