'use client';
import { SingleThread } from '@/models/singleThread';
import { useToast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DisplayTrendingThreadDialog } from './displayTrendingThread';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

const TrendingYs = () => {
  const [trendingYArr, setTrendingYs] = useState<SingleThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<SingleThread | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        console.error("Error fetching trending threads", errorResponse);
      }
    };
    fetchTrendingYs();
  }, []);

  const handleThreadClick = (thread: SingleThread) => {
    setIsDialogOpen(true);
    setSelectedThread(thread);
  };

  return (
<div className="flex justify-center min-h-[380px]">
  <div className="w-80 bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-lg p-6 shadow-2xl space-y-4">
    <div className="space-y-3">
      {trendingYArr.slice(0, 5).map((item, index) => (
        <HoverCard key={index}>
          <HoverCardTrigger asChild>
            <div
              className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 duration-200"
              onClick={() => handleThreadClick(item)}
            >
              <h3 className="font-medium text-gray-300 hover:text-gray-100 text-lg">{item.title}</h3>
            </div>
          </HoverCardTrigger>
        </HoverCard>
      ))}
    </div>
  </div>
  {selectedThread && (
    <DisplayTrendingThreadDialog
      title={selectedThread.title}
      data={selectedThread}
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
    />
  )}
</div>
  );
};

export default TrendingYs;
