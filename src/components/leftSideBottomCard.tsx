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
import Explore from './explore';

const LeftSideBottomCard = () => {
  const [user, setUser] = useState();
  const [CommunityName, setCommunityName] = useState('');
  const { toast } = useToast();
  const [showCreateCommunityPage, setShowCreateCommunityPage] = useState(true);
  const { data: session, status } = useSession();

  async function canCreateCommunity() {
    if (user) {
      try {
        const response = await axios.get<apiResponse>(`/api/isCommunityPresent?userName=${user}`);
        if (response.data.communityName && response.data.communityName.length > 1) {
          setCommunityName(response.data.communityName);
          setShowCreateCommunityPage(false);
          dataService.setData({ 'CommunityName': response.data.communityName });
          dataService.notifyListeners();
        }
      } catch (error) {
        const errorRes = error as AxiosError;
        toast({
          className: 'bg-[#FFAC1C]',
          title: errorRes.message,
          variant: 'destructive',
        });
      }
    }
  }
  useEffect(()=>{
    canCreateCommunity();
  },[user])
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session?.user.userName); 
    }
  }, [session, status]);

  return (
    <div>
      {/* Card */}
      <div className="min-h-[400px] flex flex-col justify-between">
        {/* Explore Section */}
        <div className="rounded-md mt-10">
          <Explore />
        </div>

        {/* Profile Link */}
        <div className="p-3 rounded-md mt-10">
          <Link href={`/Profile?userName=${session?.user.userName}`} className="text-xl font-semibold text-gray-200 mb-3">
            View Profile
          </Link>
        </div>

        {/* Create Community Section */}
        <div className="p-3 rounded-md mt-10 mb-10">
          {showCreateCommunityPage ? (
            <div className="ml-[-15px]">
              <CreateCommunityPage />
            </div>
          ) : (
            <Link href={`Profile?userName=${dataService.getData().CommunityName}`} className="text-xl font-semibold text-gray-200 mb-3">
              See Community Page
            </Link>
          )}
        </div>

        {/* Thread Dialog */}
        <div>
          <ThreadDialog />
        </div>
      </div>
    </div>
  );
};

export default LeftSideBottomCard;
