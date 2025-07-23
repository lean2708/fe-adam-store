'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { signInAction } from '@/actions/authActions';
import { useAuthStore } from '@/stores/authStore'; // adjust path if needed
import { Input } from '@/components/ui/input';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Example schema
const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginForm() {
  const signIn = useAuthStore((state) => state.signIn);
  const [values, setValues] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    const parseResult = formSchema.safeParse(values);
    if (!parseResult.success) {
      alert('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);

    const res = await signInAction(formData);

    setIsLoading(false);

    if (res.success) {
      alert(res.message);
      if (res.data) {
        signIn(res.data);
        router.push('/');
        return;
      }
    }

    alert(res.message);
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <div className='space-y-4'>
        <div className='space-y-2 relative'>
          <Input
            id='email'
            type='email'
            value={values.username}
            onChange={(e) =>
              setValues((v) => ({ ...v, username: e.target.value }))
            }
            disabled={isLoading}
            placeholder='Địa chỉ Email'
            className='w-full -px-3  py-8 rounded-none  border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none  focus-visible:border-b-2  focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none '
          />

          <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <Mail className='text-gray-500 size-5' />
          </span>
        </div>

        <div className='space-y-2 relative'>
          <Input
            id='password'
            type='password'
            value={values.password}
            onChange={(e) =>
              setValues((v) => ({ ...v, password: e.target.value }))
            }
            disabled={isLoading}
            placeholder='Mật khẩu'
            className='w-full -px-3  py-8 rounded-none  border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none  focus-visible:border-b-2  focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none '
          />

          <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <Lock className='text-gray-500 size-5' />
          </span>
        </div>
      </div>

      <div className='space-y-1 mt-8 flex justify-between'>
        <Button
          type='submit'
          disabled={isLoading}
          className='w-fit bg-foreground cursor-pointer hover:bg-foreground/80 text-secondary py-2 px-4 rounded-md font-medium'
        >
          {isLoading ? 'Đang đang nhập...' : 'Đăng nhập'}
        </Button>

        <div className='text-center'>
          <Link
            href='/forgot_password'
            className='text-sm text-primary hover:underline'
          >
            Quên mật khẩu ?
          </Link>
        </div>
      </div>
    </form>
  );
}
