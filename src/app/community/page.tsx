"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { apiResponse } from '@/types/apiResponse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useToast } from '@/hooks/use-toast';
import { SingleThread } from '@/models/singleThread';
import ThreadCard from '@/components/ThreadCard';
import { dataService } from '@/service/dataService';

dayjs.extend(relativeTime); 

const ProfileSection: React.FC = () => {
  const { data: session, status } = useSession();
  const [communityName,setCommunityName] = useState('');
  const [threadsArr, setThreadsArr] = useState<SingleThread[]>([]);
  const [user,setUser] = useState({userName:'',email:''});
  const [createdAt,setCreatedAt] = useState(new Date());
  const {toast}=useToast();

  const joinedAt = dayjs(createdAt).fromNow();
  const fetchThreads = async () =>{
    if(status === 'authenticated' && session?.user){
      try {
        setUser(session?.user);
        const response = await axios.get(`/api/getCommunityThreads?userName=${user.userName}`);
        if(response.data.success === true){
          setThreadsArr(response.data.threads||[]);
          setCommunityName(response.data.communityName);
          setCreatedAt(response.data.createdAt);
          dataService.setData({threadsArr:response.data.threads|| []});
          dataService.notifyListeners(); 
        }
        else{
          toast({
            className:'bg-[#FFAC1C]',
            title: "Something went wrong while fetching threads",
            description: response.data.message,
          });
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
    }

  }
  useEffect(()=>{
    fetchThreads();
  },[session,status])

  return (
    <>
<div className="w-full lg:w-2/3 mx-auto mt-4">
  {/* Profile Section */}
  <div className="bg-white p-4 rounded-lg shadow-md max-w-xs mb-4">
    <div className="text-lg font-bold mb-1">{communityName}</div>
    <div className="text-sm text-gray-600 mb-2">{user.userName}</div>
    <div className="text-sm text-gray-600 mb-2">{user.email}</div>
    <div className="text-xs text-gray-400">created{joinedAt}</div>
  </div>

  {/* Thread List Section */}
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

    </>
  );
};

export default ProfileSection;


