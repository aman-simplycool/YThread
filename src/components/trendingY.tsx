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
  const [selectedThread,setSelectedThread] = useState<SingleThread|null>(null);
  const [isDialogOpen,setIsDialogOpen] = useState(false);
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

  const handleThreadClick = (thread:SingleThread)=>{
    setIsDialogOpen(true);
    setSelectedThread(thread);
  }

  return (
    <div className="flex justify-center h-80">
      <div className="w-80 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center mb-4">Most Trending Y&apos;s</h2>
        <div className="space-y-3">
          {trendingYArr.slice(0, 5).map((item, index) => (
          <HoverCard key={index}>
          <HoverCardTrigger asChild>
            <div className="bg-white p-3 rounded-md shadow-sm cursor-pointer" onClick={()=>handleThreadClick(item)}>
              <h3 className="font-medium text-gray-800">{item.title}</h3>
            </div>
            </HoverCardTrigger>

            <HoverCardContent className="p-4 bg-gray-800 rounded-lg shadow-lg text-white border-none transition-transform transform hover:scale-105 duration-300">
              <div className="space-y-2 text-center">
                <h4 className="text-lg font-semibold">Trending Thread</h4>
                <p className="text-sm">Click to see what &apos; s inside</p>
              </div>
            </HoverCardContent>
            </HoverCard>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href={'/explore'} className="text-blue-600 hover:text-blue-800">
            Show more
          </Link>
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
