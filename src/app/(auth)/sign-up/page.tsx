'use client'
import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import Link from "next/link";
import { useState } from 'react';
import {useDebounceCallback} from 'usehooks-ts';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signupValidation } from '@/schemas/signupSchema';
import axios, { AxiosError } from 'axios';
import { apiResponse } from '@/types/apiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Background from './background';
export default function SignUpForm(){
  const [userName,setUserName] = useState('');
  const [userNameMessage,setUserNameMessage] = useState('');
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting,setIsSubmitting]= useState(false);
  const debounced = useDebounceCallback(setUserName,300);
  const {toast} = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver:zodResolver(signupValidation),
    defaultValues:{
      userName:'',
      email:'',
      password:'',
    }
  });
  useEffect(()=>{
    const checkUserName = async ()=>{
      if(userName){
        setIsCheckingUserName(true);
        setUserNameMessage('');
        try {
          const response = await axios.get(`/api/userNameValidation?userName=${userName}`);
          setUserNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          setUserNameMessage(axiosError.response?.data.message??"Some error occured while user name validation");
        }
        finally {
          setIsCheckingUserName(false);
        }
      }
    } 
    checkUserName();
  },[userName]);

  const onSubmit = async(data: z.infer<typeof signupValidation>)=>{
    setIsSubmitting(true);
    try {
      const response = await axios.post<apiResponse>('/api/sign-up', data);
      if(response.data.success=== true){
        toast({
          className:'bg-[#FFAC1C]',
          title:'Successfull sign up',
          description:response.data.message
        })
        router.replace(`/verify/${userName}`);
      }
      else{
        toast({
          className:'bg-[#FFAC1C]',
          title:'sign up failed',
          description:response.data.message
        })
      }
    } catch (error) {
      const errorResponse = error as AxiosError<apiResponse>; 
      toast({
        title:'Error',
        description:errorResponse.message,
        variant:"destructive",
      })
    }
    finally{
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex relative justify-center items-center min-h-screen ">
      <div className="absolute inset-0 z-0 flex justify-center items-center">
        <Background />
      </div>
      <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-orange-700">
            Join The Exciting Threads Community
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-orange-900 text-lg font-bold'>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUserName && <Loader2 className="animate-spin" />}
                  {!isCheckingUserName && userNameMessage && (
                    <p
                      className={`text-sm ${
                        userNameMessage === 'username available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {userNameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-orange-900 text-lg font-bold'>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage className='text-orange-900 text-lg font-bold'/>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-orange-900 text-lg font-bold'>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage className='text-orange-900 text-lg font-bold'/>
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full bg-yellow-800' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className='text-orange-900 text-lg font-bold'>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
