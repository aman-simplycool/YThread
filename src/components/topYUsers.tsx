'use client';
import { toast } from '@/hooks/use-toast';
import { UserThread } from '@/models/UserThreads';
import { apiResponse } from '@/types/apiResponse';
import axios from 'axios';
import { User } from 'next-auth';
import React from 'react'
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
  return (
    <div className="flex justify-center min-h-[320px]">
      <div className="w-80 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center mb-4">Top Users</h2>
        <div className="space-y-3">
          {topUsersArr.map((item, index) => (
            <div key={index} className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="font-medium text-gray-800">{item.userName}</h3>
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