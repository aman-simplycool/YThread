"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { yThreadSchemaValidation } from '@/schemas/yThreadSchema';
import { z } from 'zod';
import { Button } from "@/components/ui/button";

import './style.css'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { apiResponse } from '@/types/apiResponse';
import { toast } from '@/hooks/use-toast';
import { dataService } from '@/service/dataService';
import { ServiceDataType } from '@/types/serviceData';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SingleThreadModel, { SingleThread } from '@/models/singleThread';

export function ThreadDialog() {
  const [user, setUser] = useState<string | undefined>();
  const [communityName,setCommunityName]= useState();
  const [fetchCommunityMessage,setFetchCommunityMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [checked,setChecked] = useState(false);
  type ThreadFormData = z.infer<typeof yThreadSchemaValidation>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ThreadFormData>({
    resolver: zodResolver(yThreadSchemaValidation),
  });

  const { data: session, status } = useSession();

  const fetchCommunityDetails = async()=>{
    if(user){
      const response =await axios.get(`/api/isCommunityPresent?userName=${user}`);
      if(response.data.success){
        setFetchCommunityMessage(response.data.message);
        setCommunityName(response.data.communityName);
      }
      else{
        toast({
          className:'bg-[#FFAC1C]',
          title:'something went wrong',
          variant:'destructive',
        })
      }
    }
  }
  useEffect(() => {
    if(status === 'authenticated' && session.user){
      setUser(session?.user.userName);

      fetchCommunityDetails();
    }
  }, [session, status]);

  // Handler for form submission
  const onSubmit = async (data: ThreadFormData) => {
    const titleWithHash = data.title.startsWith('#') ? data.title : `#${data.title}`;

    const updatedData = {
      title: titleWithHash,
      userName: user || '',
      message: data.message,
      communityPost:data.communityPost||'No',
      communityName:communityName||''
    };
    try {
      const response = await axios.post<apiResponse>('/api/createyThread', updatedData);
      if (response.data.success) {
        toast({
          className:'bg-[#FFAC1C]',
          title: "Posted Thread successfully",
        });
        reset();
        setIsDialogOpen(false);
        dataService.setData({
          newThread: [updatedData ]
        });
      } else {
        toast({
          className:'bg-[#FFAC1C]',
          title: "Please try later, something went wrong",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        className:'bg-[#FFAC1C]',
        title: "An error occurred",
        variant: 'destructive',
      });
    }
  };

  return (
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

  <DialogTrigger asChild>
    <Button>Create Thread</Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[425px] border-none">
  <DotLottieReact
      src="https://lottie.host/2d400d1a-cdd9-4e17-97bb-96725875ebc2/gR3UHgbZHS.json"
      loop
      autoplay
    />
    <div className='dialog-animate border-2 border-gray-300 rounded-lg shadow-md p-4 bg-[#403f3d]'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle className=' flex justify-center'>Create Thread</DialogTitle>
        <DialogDescription className='font-bold flex justify-center items-center text-center'>
          Add your thread below. Click save when you &apos; re done.
        </DialogDescription>
      </DialogHeader>
      <div className="">
      <div className="flex flex-col mb-4">
          <Label htmlFor="title" className="text-right mb-1 font-semibold text-gray-700">
            Title
          </Label>
          <Input
            id="title"
            placeholder="#YourTitle"
            {...register('title')}
            className="h-10 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <Label htmlFor="message" className="text-right mb-1 font-semibold text-gray-700">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Enter your message here..."
            {...register('message')}
            className="h-40 w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>
        {/* Conditionally render the radio buttons based on fetchCommunityMessage */}
        {fetchCommunityMessage === 'already exist' && (
          <div className="flex flex-col mb-2 items-center">
            <Label htmlFor="communityPost" className="mb-2">
              Post for Community
            </Label>
            <div className="col-span-3 flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="Yes"
                  {...register('communityPost')}
                  className="form-radio"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="No"
                  {...register('communityPost')}
                  className="form-radio"
                />
                <span>No</span>
              </label>
            </div>
            {errors.communityPost && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.communityPost.message}
              </p>
            )}
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
    </div>

  </DialogContent>
</Dialog>
  );
}

export default ThreadDialog;
