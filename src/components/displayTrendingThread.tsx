'use client';
import React, { FC, ReactNode } from 'react'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SingleThread } from '@/models/singleThread';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface customDialogProps{
  data:SingleThread;
  title:string;
  isOpen:boolean;
  onClose: () => void;
}
dayjs.extend(relativeTime); 

export function DisplayTrendingThreadDialog(
  {
  title, data, isOpen, onClose 
}:customDialogProps){
  const timeAgo = dayjs(data.createdAt).fromNow();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-none">
      <DotLottieReact
      src="https://lottie.host/63af03f0-2446-4622-9413-ce9c76586d6c/OXrhNE8aQ6.json"
      loop
      autoplay
    />
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-4">
      {/* Title and Time Row */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{data.title}</h2>
        <span className="text-sm text-gray-500">{timeAgo}</span>
      </div>
      {/* Username and Message Row */}
      <div className="mt-2">
        <p className="text-sm text-gray-700 font-semibold">{data.userName}</p>
        <p className="text-base text-white mt-1">{data.message}</p>
      </div>
      {/* Yes/No Counts Row */}
      <div className="mt-4 flex justify-start space-x-4">
        <div className="flex items-center">
          <span className="text-green-600 font-semibold">{data.yesCount}</span>
        </div>
        <div className="flex items-center">
          <span className="text-red-600 font-semibold">{data.noCount}</span>
        </div>
      </div>
    </div>
      </DialogContent>
    </Dialog>
  )
}
