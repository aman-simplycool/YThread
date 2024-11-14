'use client';
import { toast } from '@/hooks/use-toast';
import { UserThread } from '@/models/UserThreads';
import { apiResponse } from '@/types/apiResponse';
import axios from 'axios';
import React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';
const TopYUsers = () => {
  const[topUsersArr,SetTopUserArr]=useState<UserThread[]>([]);
  useEffect(()=>{
    const fetchTopYUsers = async()=>{
      try {
        const response = await axios.get<apiResponse>('/api/mostFollowedUsers');
        if(response.data.success === false){
          toast({
            className:'bg-[#FFAC1C]',
            title:'something went wrong',
            variant:'destructive',
          })
        }
        else{
          SetTopUserArr(response.data.topFollowing||[]);
        }
      } catch (error) {
        const errorResponse = error as apiResponse;
        toast({
          className:'bg-[#FFAC1C]',
          title: 'Error',
          description: errorResponse.message,
          variant: 'destructive',
        });
      }
    }
    fetchTopYUsers();
  },[]);
  const router = useRouter();
  const redirectToProf = (userName:string) => () => {
    router.push(`/Profile?userName=${userName}`);
  };
  return (
    <div className="flex justify-center min-h-[320px]">
      <div className="w-80 rounded-lg">
        <div className="space-y-3">
          {topUsersArr.map((item, index) => (
            <div key={index} className="bg-gradient-to-r  from-gray-700 to-gray-800 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 duration-200">
              <button onClick={redirectToProf(item.userName)}>
               <h3 className="font-medium text-gray-300 hover:text-gray-100">{item.userName}</h3>
              </button>

            </div>
          ))}
        </div>
        <div className="text-center mt-62">
        </div>
      </div>
    </div>
  )
}

export default TopYUsers;