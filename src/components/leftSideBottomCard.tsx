"use client";
import React, { useEffect, useState } from 'react';
import { CreateCommunityPage } from './createCommunityPage';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { toast, useToast } from '@/hooks/use-toast';
import { Button } from '@nextui-org/react';
import { dataService } from '@/service/dataService';
import { apiResponse } from '@/types/apiResponse';
import ThreadDialog from './ThreadDialog';
import { useSession } from 'next-auth/react';
const LeftSideBottomCard = () => {
  const [user,setUser]= useState();
  const [CommunityName,setCommunityName]= useState('');
  const {toast}= useToast();
  const [showCreateCommunityPage,setShowCreateCommunityPage]= useState(true);
  const {data:session,status} = useSession();
  async function canCreateCommunity() {
    if(user){
      try {
        const response = await axios.get<apiResponse>(`/api/isCommunityPresent?userName=${user}`);
        if(response.data.communityName){
          setCommunityName(response.data.communityName);
          setShowCreateCommunityPage(false);
          dataService.setData({'CommunityName':response.data.communityName});
          dataService.notifyListeners();
        }
      } catch (error) {
        const errorRes = error as AxiosError;
        toast({
          className:'bg-[#FFAC1C]',
          title:errorRes.message,
          variant:'destructive'
        })
      }
    }
  }
  useEffect(()=>{
    if(status === 'authenticated' && session.user){
      setUser(session?.user.userName);
      canCreateCommunity();
    }
  },[session,status]);

  return (
<div >
  {/* Card */}
  <div className="shadow-lg min-h-[400px] flex flex-col justify-between">
      <div className="bg-white p-3 rounded-md mt-16">
        <Link href="/explore" >Explore</Link>
      </div>
      <div className="bg-white p-3 rounded-md mt-16">
        <Link href="/Profile" >Profile</Link>
      </div>
      <div className="bg-white p-3 rounded-md mt-16 mb-16">
      {showCreateCommunityPage?(
        <Link href='/community' >see Community Page</Link>
      ):(
        <div className='ml-[-15px]'>
        <CreateCommunityPage/>
        </div>

      )}
      </div>
      <div>
        <ThreadDialog/>
      </div>
  </div>
</div>

  )
}

export default LeftSideBottomCard
