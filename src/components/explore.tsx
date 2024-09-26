import { SingleThread } from '@/models/singleThread'
import { toast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const Explore = () => {
  const [trendingThreads , setTrendingThreads ] = useState<SingleThread[]>([]);
  const [isFetching, setIsFetchingThreads] = useState(false);
  useEffect(()=>{
    const fetchTrendingYs = async ()=>{
      try {
        const response= await axios.get<apiResponse>('/api/getTrendingYThreads');
        if(response.data.success === true && response.data.Threads){
          setTrendingThreads(response.data.Threads);
        }
        else{
          toast({
            className:'bg-[#FFAC1C]',
            title: 'Error',
            description: response.data.message,
          })
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
    fetchTrendingYs(); 
  },[])
  return (
    <div></div>
  )
}

export default Explore