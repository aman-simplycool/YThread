'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { apiResponse } from '@/types/apiResponse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter,useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { SingleThread } from '@/models/singleThread';
import ThreadCard from '@/components/ThreadCard';
import { dataService } from '@/service/dataService';
import { FaHome } from 'react-icons/fa';

// import '../style.css'
dayjs.extend(relativeTime); 

const ProfileSection: React.FC =()=> {

  const [threadsArr, setThreadsArr] = useState<SingleThread[]>([]);
  const [createdAt,setCreatedAt] = useState(new Date());
  const [following,setFollowing] = useState(0);
  const [followers,setFollowers] = useState(0);
  const {toast}=useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName');
  //userObj or communityObj
  const joinedAt = dayjs(createdAt).fromNow();
  const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/api/fetchProfileData?userName=${userName}`);
        if (response.data.success) {
          setThreadsArr(response.data.result.threadsArr || []);
          setCreatedAt(response.data.result.createdAt);
          setFollowing(response.data.result.following.length);
          setFollowers(response.data.result.followers.length);
        } else {
          toast({
            className: 'bg-[#FFAC1C]',
            title: 'Something went wrong while fetching threads',
            description: response.data.message,
          });
        }
      } catch (error) {
        const errorResponse = error as AxiosError<apiResponse>;
        toast({
          className: 'bg-[#FFAC1C]',
          title: 'Error',
          description: errorResponse.message,
          variant: 'destructive',
        });
      }

  };
  // Fetch threads and createdAt after userName has been set
  useEffect(() => {
    if (userName) {
      fetchProfileData();
    }
  }, []);
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-8 rounded-lg shadow-xl mb-8">
        <div className="flex justify-between items-center">
          <FaHome 
            onClick={() => router.push('/')} 
            className="text-white text-2xl cursor-pointer hover:text-yellow-400 transition-colors duration-300" 
          />
          <h2 className="text-3xl font-extrabold text-white">Profile</h2>
        </div>

        {/* User Info Section */}
        <div className="flex justify-center items-center mt-6">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white">{userName}</h3>
            <p className="text-lg text-gray-200 mt-2">Joined:{joinedAt}</p>
          </div>
        </div>

        {/* Follow Stats Section */}
        <div className="flex justify-evenly mt-8">
          <div className="text-center">
            <p className="text-sm text-gray-200">Following</p>
            <p className="text-xl font-semibold text-white">{following}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-200">Followers</p>
            <p className="text-xl font-semibold text-white">{followers}</p>
          </div>
        </div>
      </div>

      {/* Threads Section */}
      <div className="space-y-6">
        {threadsArr.length > 0 ? (
          threadsArr.map((thread, index) => (
            <ThreadCard
              key={thread.id}
              index={index}
              title={thread.title}
              createdAt={new Date(thread.createdAt).toISOString()}
              userName={thread.userName}
              message={thread.message}
              yesCount={thread.yesCount}
              noCount={thread.noCount}
              doesFollow={false} // If you want a "follow" functionality, you can adjust this
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No threads currently</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;


