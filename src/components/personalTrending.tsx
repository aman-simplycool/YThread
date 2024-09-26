import { SingleThread } from '@/models/singleThread';
import { useToast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DisplayTrendingThreadDialog } from './displayTrendingThread';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const PersonalTrending = () => {
  const [trendingYArr, setTrendingYs] = useState<SingleThread[]>([]);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<SingleThread | null>(null);

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
            className:'bg-[#FFAC1C]',
            title: 'Error',
            description: errorResponse.message,
            variant: 'destructive',
          });
        }
      }
    };
    
    fetchTrendingYs();
  }, [session, status]);

  const handleThreadClick = (thread: SingleThread) => {
    setSelectedThread(thread);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex justify-center min-h-[380px]">
      <div className="w-80 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center mb-4">Your Trending Y&apos;s</h2>
        <div className="space-y-3">
          {trendingYArr.slice(0, 5).map((item, index) => (
            <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div
                className="bg-white p-3 rounded-md shadow-sm cursor-pointer"
                onClick={() => handleThreadClick(item)}
              >
                <h3 className="font-medium text-gray-800">{item.title}</h3>
              </div>
            </HoverCardTrigger>

            <HoverCardContent className="p-4 bg-gray-800 rounded-lg shadow-lg text-white border-none transition-transform transform hover:scale-105 duration-300">
              <div className="space-y-2 text-center">
                <h4 className="text-lg font-semibold">Trending Thread</h4>
                <p className="text-sm">Click to see what&apos;s inside</p>
              </div>
            </HoverCardContent>
            </HoverCard>
          ))}
        </div>
        <div className="text-center mt-4">
        </div>
      </div>

      {/* Render the dialog */}
      {selectedThread && (
        <DisplayTrendingThreadDialog
          title={selectedThread.title}
          data={selectedThread} // Pass the selected thread data
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)} // Close dialog handler
        />
      )}
    </div>
  );
};

export default PersonalTrending;
