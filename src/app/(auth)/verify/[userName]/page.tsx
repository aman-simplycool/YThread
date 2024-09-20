'use client';
import { verifySchema } from '@/schemas/verifySchema';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z  from 'zod';

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{userName:string}>();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data:z.infer<typeof verifySchema>)=>{

    try {
      const response = await axios.post('/api/verify-code',{
        userName:params.userName,
        verifyCode:data.code,
      });
      toast({
        title:"success",
        description:response.data.message
      })
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title:"failure",
        description:axiosError.response?.data.message??"some error occured while verifying otp",
      });
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} className='border-black border-4'/>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit">Verify</Button>
          </form>
        </Form>
        </div>
        </div>
  )
}

export default VerifyAccount