"use client";
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FaFrownOpen } from "react-icons/fa";
import { PiSmileyFill } from "react-icons/pi";
import { dataService } from '@/service/dataService';
import { SingleThread } from '@/models/singleThread';
import axios from 'axios';
import { apiResponse } from '@/types/apiResponse';
import { useToast } from '@/hooks/use-toast';
import { useDebounceCallback } from 'usehooks-ts';

dayjs.extend(relativeTime); 

interface ThreadCardProps {
  key: string;
  index: number;
  title: string;
  createdAt: string;
  userName: string;
  message: string;
  yesCount: number;
  noCount: number;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ index, title, createdAt, userName, message, yesCount, noCount }) => {
  const timeAgo = dayjs(createdAt).fromNow();
  const{toast} = useToast();
  // State to track like/dislike
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [userResponse ,setUserResponse] = useState(0);
  const [id,setId] = useState('');
  const [threadsArr, setThreadsArr] = useState<SingleThread[]>([]);
  const debounced = useDebounceCallback(setUserResponse, 500);

  useEffect(() => {
    // Define handleServiceUpdate outside of setTimeout
    const handleServiceUpdate = (data: any) => {
      if (data.threadsArr) {
        setThreadsArr(data.threadsArr);
      }
    };
  
    // Function to fetch initial data with a delay
    const fetchDataWithDelay = () => {
      setTimeout(() => {
        const initialData = dataService.getData().threadsArr || [];
        setThreadsArr(initialData);
        
        // Subscribe to dataService updates
        dataService.subscribe(handleServiceUpdate);
      }, 2000); // 2-second delay
    };
  
    fetchDataWithDelay();

    // Cleanup subscription
    return () => {
      dataService.unsubscribe(handleServiceUpdate);
    };

    
  }, []);

  const handleLike = async (index: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setId(threadsArr[index]._id as string);
    if(disliked===false){
      setLiked(!liked);
      setId(threadsArr[index]._id as string);
      const updatedThreadsArr = [...threadsArr];
      if (!liked) {
        updatedThreadsArr[index].yesCount++;
      } else {
        updatedThreadsArr[index].yesCount--;
      }
      if(liked){
        debounced(1);
      }
      if(!liked){
        debounced(-1);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axios.get<apiResponse>(`/api/getSingleThread?id=${threadsArr[index]._id}`);
      if(response.data.thread?.yesCount!=userResponse){
          const res = await axios.post('/api/UserResponse',{id,type:'yes',userResponse,userName});
          if(res.data.success === true){
            toast({
              title:'updated successfully',
              variant:'default'
            })
          }
          else{
            toast({
              title:'something went wrong',
              variant:'destructive',
            })
          }
      }
      
      // Update local state
      setThreadsArr(updatedThreadsArr);
  
      // Update the data service
      dataService.setData({ threadsArr: updatedThreadsArr });
      dataService.notifyListeners(); 
    }
    else{
      toast({
        title:'please click on like to be on default state'
      })
    }
  };

  const handleDislike = async (index: number) => {
    setId(threadsArr[index].id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if(liked===false){ 
        setDisliked(!disliked);
        setId(threadsArr[index]._id as string);
        const updatedThreadsArr = [...threadsArr];
        if (!disliked) {
          updatedThreadsArr[index].noCount++;
        } else {
          updatedThreadsArr[index].noCount--;
        }
        if(disliked){
          debounced(1);
        }
        if(!disliked){
          debounced(1);
        }
        await new Promise((resolve)=>setTimeout(resolve,1000));

        const response = await axios.get<apiResponse>(`/api/getSingleThread?id=${threadsArr[index]._id}`);
        if(response.data.yesCount!=userResponse){
            const res = await axios.post('/api/UserResponse',{id,type:'no',userResponse,userName});
            if(res.data.success === true){
              toast({
                title:'updated successfully',
                variant:'default'
              })
            }
            else{
              toast({
                title:'something went wrong',
                variant:'destructive',
              })
            }
        }

        // Update local state
        setThreadsArr(updatedThreadsArr);

        // Update the data service
        dataService.setData({ threadsArr: updatedThreadsArr });
        dataService.notifyListeners(); 
      }
    else{
      toast({
        title:'please click on like to be on default state'
      })
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      {/* Title and Time Row */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-sm text-gray-500">{timeAgo}</span>
      </div>
      {/* Username and Message Row */}
      <div className="mt-2">
        <p className="text-sm text-gray-700 font-semibold">{userName}</p>
        <p className="text-base text-gray-800 mt-1">{message}</p>
      </div>
      {/* Yes/No Counts Row */}
      <div className="mt-4 flex justify-start space-x-4">
        <div className="flex items-center">
          <span className="text-green-600 font-semibold">{yesCount}</span>
          <PiSmileyFill onClick={() => handleLike(index)} />
        </div>
        <div className="flex items-center">
          <span className="text-red-600 font-semibold">{noCount}</span>
          <FaFrownOpen onClick={() => handleDislike(index)} />
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
