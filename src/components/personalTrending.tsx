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
  <div className="w-80 rounded-lg space-y-4">
    {trendingYArr.length > 0 ? (
      // Render trending threads if they exist
      <div className="space-y-4">
        {trendingYArr.slice(0, 5).map((item, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div
                className="p-4 rounded-lg bg-gray-900 text-white shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl duration-300"
                onClick={() => handleThreadClick(item)}
              >
                <h3 className="font-medium text-lg tracking-tight">{item.title}</h3>
              </div>
            </HoverCardTrigger>
          </HoverCard>
        ))}
      </div>
    ) : (
      // Custom message when no trending threads
      <div className="text-center p-4 bg-gray-700 rounded-md shadow-md">
        <p className="text-gray-400">You are not trending right now. Post a thread to see changes here!</p>
      </div>
    )}

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
</div>

  );
};

export default PersonalTrending;
