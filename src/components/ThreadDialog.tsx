"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { yThreadSchemaValidation } from '@/schemas/yThreadSchema';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
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
import SingleThreadModel, { SingleThread } from '@/models/singleThread';

export function ThreadDialog() {
  const [user, setUser] = useState<string | undefined>();
  const [communityName,setCommunityName]= useState();
  const [fetchCommunityMessage,setFetchCommunityMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    const response =await axios.get(`/api/isCommunityPresent?userName=${user}`);
    if(response.data.success){
      setFetchCommunityMessage(response.data.message);
      setCommunityName(response.data.communityName);
    }
    else{
      toast({
        title:'something went wrong',
        variant:'destructive',
      })
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
          title: "Posted Thread successfully",
        });
        reset();
        setIsDialogOpen(false);
        dataService.setData({
          newThread: [updatedData ]
        });
      } else {
        toast({
          title: "Please try later, something went wrong",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred",
        variant: 'destructive',
      });
    }
  };

  return (
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Create Thread</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>Create Thread</DialogTitle>
        <DialogDescription>
          Add your thread details below. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            placeholder="#YourTitle"
            {...register('title')}
            className="col-span-3"
          />
          {errors.title && (
            <p className="col-span-4 text-red-500 text-sm">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="message" className="text-right">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Enter your message here..."
            {...register('message')}
            className="col-span-3 h-40 w-full bg-white border border-gray-300 p-2 rounded-md"
          />
          {errors.message && (
            <p className="col-span-4 text-red-500 text-sm">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Conditionally render the radio buttons based on fetchCommunityMessage */}
        {fetchCommunityMessage === 'already exist' && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="communityPost" className="text-right">
              Post for Community
            </Label>
            <div className="col-span-3 flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="Yes"
                  {...register('communityPost')}
                  className="form-radio"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
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
  </DialogContent>
</Dialog>
  );
}

export default ThreadDialog;
