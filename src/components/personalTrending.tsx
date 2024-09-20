'use client';
import { SingleThread } from '@/models/singleThread';
import { useToast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const PersonalTrending = () => {
  const [trendingYArr, setTrendingYs] = useState<SingleThread[]>([]);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchTrendingYs = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await axios.get<apiResponse>(`/api/personalTrendingThreads?userName=${session.user.userName}`);
          
          if (response.data.success === true && response.data.Threads) {
            setTrendingYs(response.data.Threads); // Directly set the threads
          }
        } catch (error) {
          const errorResponse = error as AxiosError<apiResponse>;
          toast({
            title: 'Error',
            description: errorResponse.message,
            variant: 'destructive',
          });
        }
      }
    };    
    fetchTrendingYs();
  }, [session, status,]);

  return (
    <div className="flex justify-center min-h-[380px]">
      <div className="w-80 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center mb-4">Your Trending Y&apos;s</h2>
        <div className="space-y-3">
          {trendingYArr.slice(0, 5).map((item, index) => (
            <div key={index} className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="font-medium text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
        </div>
      </div>
    </div>
  );
}

export default PersonalTrending;
