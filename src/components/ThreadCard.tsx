"use client";
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FaFrownOpen, FaSmile } from "react-icons/fa";
import { PiSmileyFill } from "react-icons/pi";
import { dataService } from '@/service/dataService';
import { SingleThread } from '@/models/singleThread';
import axios from 'axios';
import { apiResponse } from '@/types/apiResponse';
import { useToast } from '@/hooks/use-toast';
import { useDebounceCallback } from 'usehooks-ts';
import { useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

dayjs.extend(relativeTime); 

interface ThreadCardProps {
  index: number;
  title: string;
  createdAt: string;
  userName: string;
  message: string;
  yesCount: number;
  noCount: number;
  doesFollow:boolean;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ index,title, createdAt, userName, message, yesCount, noCount, doesFollow}) => {
  const timeAgo = dayjs(createdAt).fromNow();
  const{toast} = useToast();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [userResponse ,setUserResponse] = useState(0);
  const [doesFollows,setDoesFollows] = useState(false);
  const [id,setId] = useState('');
  const {data:session,status} = useSession();

  const[user,setUser] = useState('');
  const [threadsArr, setThreadsArr] = useState<SingleThread[]>([]);
  const debounced = useDebounceCallback(setUserResponse, 500);
  const [communityName,setCommunityName] = useState('');
  async function fetchCommunityName(){
      const res = await axios.get<apiResponse>(`/api/isCommunityPresent?userName=${session?.user.userName}`);
      if(res.data.isPresent){
        setCommunityName(res.data.communityName||'');
      }
      else{
        setCommunityName('');
      }
  }
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
      }, 2000);
    };
    fetchDataWithDelay();

    return () => {
      dataService.unsubscribe(handleServiceUpdate);
    };
  }
  , []);
  useEffect(()=>{
    if(user)fetchCommunityName();
  },[user])
  useEffect(()=>{
    setUser(session?.user.userName);
},[session,status])
  async function updateFollowings(userName:String){
    const response = await axios.post<apiResponse>('/api/updateFollowings/',{currentUser:user,userName,doesFollows});
    if(response.data.success){
      toast({
        title:'updated',
        className:'bg-[#FFAC1C]',
        variant:'default',
      })
    }
    else{
      toast({
        title:'something went wrong',
        className:'bg-[#FFAC1C]',
        variant:'destructive',
      })
    }
  }
  async function handleLike(index: number){
    if(userName===session?.user.userName||session?.user.userName===communityName){
      return toast({
        className:'bg-[#FFAC1C]',
        title:'you can not like your own posts',
        variant:'destructive'
      })
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    if(disliked===false && threadsArr[index]._id){
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
      try {
        // const response = await axios.get<apiResponse>(`/api/getSingleThread?id=${threadsArr[index]._id}`);
        const res = await axios.post('/api/UserResponse',{id,type:'yes',userResponse,userName:user});
        if(res.data.success === false){
          toast({
            className:'bg-[#FFAC1C]',
            title:'something went wrong',
            variant:'destructive',
          })
        }
    
    // Update local state
    setThreadsArr(updatedThreadsArr);

    // Update the data service
    dataService.setData({ threadsArr: updatedThreadsArr });
    dataService.notifyListeners(); 
      } catch (error) {
        toast({
          className:'bg-[#FFAC1C]',
          title:`${error}`,
          variant:'destructive'
        })
      }
  };
}

  const handleDislike = async (index: number) => {

    if(userName===session?.user.userName||session?.user.userName===communityName){
      return toast({
        className:'bg-[#FFAC1C]',
        title:'you can not like your own posts',
        variant:'destructive'
      })
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    setId(threadsArr[index].id);
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
            const res = await axios.post('/api/UserResponse',{id,type:'no',userResponse,user});
            if(res.data.success === true){
              toast({
                className:'bg-[#FFAC1C]',
                title:'updated successfully',
                variant:'default'
              })
            }
            else{
              toast({
                className:'bg-[#FFAC1C]',
                title:'something went wrong',
                variant:'destructive',
              })
            }

        // Update local state
        setThreadsArr(updatedThreadsArr);

        // Update the data service
        dataService.setData({ threadsArr: updatedThreadsArr });
        dataService.notifyListeners(); 
      }
    else{
      toast({
        className:'bg-[#FFAC1C]',
        title:'please click on like to be on default state'
      })
    }
  };
  return (
      <div className="bg-gradient-to-b from-white via-gray-100 to-gray-50 p-4 rounded-lg shadow-md mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        {/* Title and Time Row */}
        <div className="flex items-center justify-center mb-2 relative">
          <h2 className="text-lg font-semibold text-gray-900 mx-auto">{title}</h2>
          <span className="absolute right-0 text-xs text-gray-400">{timeAgo}</span>
        </div>

        {/* Dropdown Menu Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200">
            ...
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg border rounded-md overflow-hidden">
            <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-150">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => updateFollowings(userName)} 
              className="text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-150"
            >
              {doesFollow ? 'Unfollow' : 'Follow'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Username and Message Row */}
        <div className="mt-2">
          <p className="text-sm font-semibold text-blue-500 hover:underline cursor-pointer">{userName}</p>
          <p className="text-base text-gray-700 mt-1">{message}</p>
        </div>

        {/* Yes/No Counts Row */}
        <div className="mt-4 flex space-x-6">
          <div 
            className="flex items-center space-x-1 cursor-pointer text-gray-500 hover:text-green-500 transition-colors duration-150"
            onClick={() => handleLike(index)}
          >
            <FaSmile className="text-xl" />
            <span className="font-semibold text-gray-700">{yesCount}</span>
          </div>
          <div 
            className="flex items-center space-x-1 cursor-pointer text-gray-500 hover:text-red-500 transition-colors duration-150"
            onClick={() => handleDislike(index)}
          >
            <FaFrownOpen className="text-xl" />
            <span className="font-semibold text-gray-700">{Math.abs(noCount)}</span>
          </div>
        </div>
      </div>
  )
};

export default ThreadCard;
