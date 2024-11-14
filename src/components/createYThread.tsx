import { yThreadSchemaValidation } from '@/schemas/yThreadSchema';
import { toast } from '@/hooks/use-toast';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from '@nextui-org/react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
const CreateYThread = () => {
  const [Thread,setThreadData] = useState({});
  const [isSubmitting,setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof yThreadSchemaValidation>>({
    defaultValues:{
     message:'',
     title: '', 
    }
  })
  const onSubmit = async (data:z.infer<typeof yThreadSchemaValidation>)=>{
    setThreadData(true);
    try {
      const response = await axios.post<apiResponse>('/api/createyThread',data);
      if(response.data.success === true){
        toast({
          title:'your thread got Posted ',
          description:response.data.message
        })
      }
      else{
        toast({
          title:'umm!! something went wrong please try again',
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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200">
  <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
    Just Post Your Y
  </h2>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Title for Y"
                {...field}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md py-2 px-4"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Message</FormLabel>
            <FormControl>
              <Input
                placeholder="Put your thought in form of Y"
                {...field}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md py-2 px-4"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="submit"
        className="w-full py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-200"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
            <span>Please Wait</span>
          </div>
        ) : (
          "Y"
        )}
      </Button>
    </form>
  </Form>
</div>
  )
}

export default CreateYThread;