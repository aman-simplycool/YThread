import React, { useEffect, useState } from 'react';
import { SingleThread } from '@/models/singleThread';
import { toast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import { CiSearch } from "react-icons/ci";
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
import { useDebounceCallback } from 'usehooks-ts';

function Explore() {
  const [trendingThreads, setTrendingThreads] = useState<SingleThread[]>([]);
  const [isFetching, setIsFetchingThreads] = useState(false);
  const [usersArr, setUsersArr] = useState<{ _id: string; userName: string }[]>([]);
  const [userQuery,setUserQuery] = useState('');
  const debounced = useDebounceCallback(setUserQuery,1500);

  useEffect(() => {
    const fetchTrendingYs = async () => {
      try {
        const response = await axios.get<apiResponse>('/api/getTrendingYThreads');
        if (response.data.success === true && response.data.Threads) {
          setTrendingThreads(response.data.Threads);
        } else {
          toast({
            className: 'bg-[#FFAC1C]',
            title: 'Error',
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
    fetchTrendingYs();
  }, []);
  useEffect(()=>{
    if(userQuery)fetchUserAcc(userQuery);
  },[userQuery])
  async function fetchUserAcc(userName:string){
    try {
      const res = await axios.get<apiResponse>(`/api/getUserProfiles?query=${userName}`);
      if(res.data.success){
        setUsersArr(res.data.usersArr||[]);
      }
      else{
        setUsersArr([]);
      }
    } catch (error) {
      toast({
        title:`${error}`,
        className:'bg-[#FFAC1C]',
        variant:'destructive',
      })
    }

  }
  return (
<div>
  <Dialog>
    <DialogTrigger asChild>
      <Button className=" text-xl font-semibold text-white py-2 px-6 rounded-lg mb-4">
        Explore
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-xl p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-800">Profile</DialogTitle>
        <DialogDescription>
          <div className="relative mt-4">
            <Input
              type="email"
              placeholder="Search..."
              className="w-full pl-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => { debounced(e.target.value); }}
            />
            <CiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </DialogDescription>
      </DialogHeader>
      {usersArr.length > 0 && (
        <div className="overflow-y-auto max-h-[200px] mt-6">
          <table className="w-full table-auto">
            <tbody>
              {usersArr.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-4 text-gray-700 font-medium">{user.userName}</td>
                  <td className="text-right py-3 px-4">
                    <a
                      href={`/Profile?userName=${user.userName}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 underline"
                    >
                      See Profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DialogContent>
  </Dialog>
</div>

  );
}

export default Explore;
