'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import dynamic from 'next/dynamic';
import ConveyorBelt from './conveyerBelt';

const RocketScene = dynamic(() => import('./background'), {
  ssr: false,
});

export default function SignInForm() {
  const router = useRouter();
  const {data:Session,status}= useSession();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      if(result?.error==="Please verify your account before logging in"){
        toast({
          className:'bg-[#FFAC1C]',
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        router.replace(`/verify/${data.identifier}`);
      }
      if (result.error === 'CredentialsSignin') {
        toast({
          className:'bg-[#FFAC1C]',
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          className:'bg-[#FFAC1C]',
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/');
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen ">
      {/* Rocket Scene */}
      <div className="absolute inset-0 z-0">
        <RocketScene />
      </div>
      
      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-8  bg-opacity-90 rounded-lg shadow-md mb-48">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-orange-900">
            Welcome Back
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border-zinc-200">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='italic text-brown-400'>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='italic text-brown-400'>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full bg-orange-400' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4 text-white">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Conveyor Belt */}
      <div className="w-full">
      <ConveyorBelt />
      </div>
    </div>
  );
}