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
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { BrowserRouter, } from "react-router-dom";

import '../style.css'
dayjs.extend(relativeTime); 

const ProfileSection: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [threadsArr, setThreadsArr] = useState<SingleThread[]>([]);
  const [user,setUser] = useState({userName:'',email:''});
  const [createdAt,setCreatedAt] = useState(new Date());
  const {toast}=useToast();

  const joinedAt = dayjs(createdAt).fromNow();
  const fetchThreads = async () =>{
    if(status === 'authenticated' && session?.user){
      try {
        setUser(session?.user);
        const response = await axios.get(`/api/getPersonalyThreads?userName=${user.userName}`);
        if(response.data.success === true){
          setThreadsArr(response.data.threads||[]);
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
  // const redirectToHome = () => {
  //   router.push('/');
  // };
  const fetchCreatedAt = async ()=>{
    const res = await axios.get(`/api/fetchUserCreatedAt?userName=${user.userName}`);
    if(res.data.success){
      setCreatedAt(res.data.createdAt);
    }
  }
  useEffect(()=>{
    fetchThreads();
    fetchCreatedAt();
  },[session,status])

  return (
    <>
<div className="w-full h-full ">

  {/* Profile Section */}
  <div className='h-40 bg-blue-gray-600 top-0 flex flex-col'>
  <div className='h-10 w-10'>
  <FaHome onClick={()=>{router.push('/')}}/>
  </div>

  <div className="flex flex-row pt-20 ">

    <div className='m-auto'>
    <div className="text-sm font-bold text-white">Name</div>
    <div className="text-lg font-bold text-white">{user.userName}</div>
    </div>
    <div className='m-auto'>
    <div className="text-sm font-bold text-white">email</div>
    <div className="text-lg font-bold text-white">{user.email}</div>
    </div>
    <div className='m-auto'>
    <div className="text-sm font-bold text-white">Threads posted</div>
    <div className="text-lg font-bold text-white">{threadsArr.length}</div>
    </div>
    <div className='m-auto'>
    <div className="text-sm font-bold text-white">Joined</div>
    <div className="text-lg font-bold text-white">{joinedAt}</div>
    </div>
  </div>
  </div>


    <div className='mt-10'>
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
    <div className='flex items-center justify-center h-screen'>
    <p className='text-white  text-center'>No threads Currently</p>
    </div>

  )}
    </div>
  {/* Thread List Section */}

</div>

    </>
  );
};

export default ProfileSection;


