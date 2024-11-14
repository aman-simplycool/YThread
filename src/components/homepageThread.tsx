"use client";
import { toast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import ThreadCard from './ThreadCard';
import { dataService } from '@/service/dataService';
import { SingleThread } from '@/models/singleThread';
import { useSession } from 'next-auth/react';
import './ui/homePageThread.css';
const HomepageThread = () => {
  const serviceData = dataService.getData();
  const {data:session,status} = useSession();
  const[user,setUser] = useState('');
  const [followStatuses, setFollowStatuses] = useState<Record<string, boolean>>({});
  let typeOfThreadToRender = serviceData?.type || '';
  const [threadsArr, setThreadsArr] = useState<SingleThread[]>([]);
  useEffect(()=>{
    setUser(session?.user.userName);
},[session,status])
  const fetchThreads = async () => {
    try {
      const response = await axios.get(`/api/getyThreads?userName=${user}`);
      dataService.setData({
        threadsArr:response.data.threads||[],
      });
      dataService.notifyListeners();
      if (response.data.success === false) {
        toast({
          className:'bg-[#FFAC1C]',
          title: "Something went wrong while fetching threads",
          description: response.data.message,
        });
      } else {
        const statuses: Record<string, boolean> = {};
        for (const thread of response.data.threads) {
          if(thread.userName){
            const followStatus = await getInfoOnFollowings(user,thread.userName);
            statuses[thread.userName] = followStatus;
          }
        }
        setFollowStatuses(statuses);
        setThreadsArr(response.data.threads || []);
      }
    } catch (error) {
      const errorResponse = error as AxiosError<apiResponse>;
      toast({
        className:'bg-[#FFAC1C]',
        title: 'Error',
        description: errorResponse.message,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if(user)fetchThreads();
    const handleServiceUpdate = (data:any) => {
      if (data.newThread && Array.isArray(data.newThread)) {
          toast({
            className:'bg-[#FFAC1C]',
            title:"new thread added",
            variant:'default'
          })
        setThreadsArr(prevThreads => [...data.newThread, ...prevThreads]);
      }
      if(data.threadsArr){
        setThreadsArr(data.threadsArr);
      }
      if(data.type){
        typeOfThreadToRender = data.type;
      }
    };

    dataService.subscribe(handleServiceUpdate);
    return () => {
      dataService.unsubscribe(handleServiceUpdate);
    };    
  }, [user,session,status]);


  async function getInfoOnFollowings(user:string,userName:string): Promise<boolean> {
    try {
      if(userName){
        const res = await axios.post<apiResponse>('/api/doesFollows', { currentUser:user, targetUser:userName });
        if (res.data.success) {
          return res.data.isFollowing || false;
        } else {
          toast({
            title: 'Something went wrong while checking following',
            variant: 'destructive',
          });
          return false;
        }
      }
      return false;
    } catch (error) {
      toast({
        title: 'An error occurred while checking following status',
        variant: 'destructive',
      });
      return false;
    }
  }
  
  return (
<div>
<div className="w-full lg:w-2/3 mx-auto mt-4 h-[800px] overflow-y-auto scrollbar-hide space-y-6">
  {threadsArr.length > 0 ? (
    threadsArr.map((thread, index) => (
      <ThreadCard
        index={index}
        key={thread._id as string}
        title={thread.title}
        createdAt={new Date(thread.createdAt).toISOString()}
        userName={thread.userName}
        message={thread.message}
        yesCount={thread.yesCount}
        noCount={thread.noCount}
        doesFollow={followStatuses[thread.userName] || false}
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
