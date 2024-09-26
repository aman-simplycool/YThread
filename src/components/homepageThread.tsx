"use client";
import { toast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import ThreadCard from './ThreadCard';
import { dataService } from '@/service/dataService';
import { SingleThread } from '@/models/singleThread';
import ProfileSection from '@/app/Profile/page';

const HomepageThread = () => {
  const serviceData = dataService.getData();
  let typeOfThreadToRender = serviceData?.type || '';
  const [threadsArr, setThreadsArr] = useState<SingleThread[]>([]);
  const fetchThreads = async () => {
    try {
      const response = await axios.get('/api/getyThreads');
      dataService.setData({
        threadsArr:response.data.threads||[],
      });
      console.log(response,'this is response');
      dataService.notifyListeners(); 
      if (response.data.success === false) {
        toast({
          title: "Something went wrong while fetching threads",
          description: response.data.message,
        });
      } else {
        setThreadsArr(response.data.threads || []);
      }
    } catch (error) {
      const errorResponse = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description: errorResponse.message,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    fetchThreads();
    const handleServiceUpdate = (data:any) => {
      if (data.newThread && Array.isArray(data.newThread)) {
          toast({
            title:"new thread added",
            variant:'default'
          })
        setThreadsArr(prevThreads => [...data.newThread, ...prevThreads]);
      }
      if(data.threadsArr){
        setThreadsArr(data.threadsArr);
        toast({
          title: "Threads updated",
          variant: "default",
        });
      }
      if(data.type){
        typeOfThreadToRender = data.type;
      }
    };

    dataService.subscribe(handleServiceUpdate);
    return () => {
      dataService.unsubscribe(handleServiceUpdate);
    };    
  }, [typeOfThreadToRender]);

  return (
  <div>
    <div className="w-full lg:w-2/3 mx-auto mt-4">
      {threadsArr.length > 0 ? (
        threadsArr.map((thread, index) => (
          <ThreadCard
            index={index}
            key={thread.id}
            title={thread.title}
            createdAt={new Date(thread.createdAt).toISOString()}
            userName={thread.userName}
            message={thread.message}
            yesCount={thread.yesCount}
            noCount={thread.noCount}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>

  );
};

export default HomepageThread;
