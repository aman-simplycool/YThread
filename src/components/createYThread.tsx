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
    <div>
      <div>
        just post your y 
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
          control={form.control}
          name='title'
          render={({field})=>(
           <FormItem>
            <FormLabel>
              Title
            </FormLabel>
            <FormControl>
              <Input placeholder='title for Y' {...field}
              />
            </FormControl>
            </FormItem>
          )}
          />
        <FormField
        control={form.control}
        name = 'message'
        render={({field})=>(
          <FormItem>
            <FormLabel>
              Message
            </FormLabel>
            <FormControl>
              <Input placeholder='put your thought in form of y' {...field}/>
            </FormControl>
            </FormItem>
        )}
        />
        <Button type='submit'>
          {
            isSubmitting?(
              <Loader2 className='animate-spin mr-2 h-4'>
                please wait
              </Loader2>
            ):('Y')
          }
        </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateYThread;