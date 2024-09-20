'use client';
import { SingleThread } from '@/models/singleThread';
import { useToast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const TrendingYs = () => {
  const [trendingYArr, setTrendingYs] = useState<SingleThread[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrendingYs = async () => {
      try {
        const response = await axios.get<apiResponse>('/api/getTrendingYThreads');
        if (response.data.success === true && response.data.Threads) {
          setTrendingYs(response.data.Threads);
        }
      } catch (error) {
        const errorResponse = error as AxiosError<apiResponse>;
      }
    };
    fetchTrendingYs();
  }, []);

  return (
    <div className="flex justify-center h-80">
      <div className="w-80 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center mb-4">Most Trending Y&apos;s</h2>
        <div className="space-y-3">
          {trendingYArr.slice(0, 5).map((item, index) => (
            <div key={index} className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="font-medium text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href={'/explore'} className="text-blue-600 hover:text-blue-800">
            Show more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrendingYs;
