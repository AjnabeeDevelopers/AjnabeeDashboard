'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Suspense } from 'react';

function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'The credentials you entered are incorrect. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: `${result.error}`,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300">
      <div className="w-full max-w-md p-8 space-y-8 bg-yellow-900 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Access</h1>
          <p className="text-sm text-gray-200">
            Sign in to manage salons securely
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">Email</FormLabel>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="border-gray-600  text-gray-300 placeholder-gray-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="border-gray-600  text-gray-300 placeholder-gray-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account? &nbsp;
            <Link href="/sign-up" className="text-yellow-400 hover:text-yellow-500 font-medium">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewSuspenseBoundaryWrappedSignInForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
