'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/modules/PasswordInput';
import { useTranslations } from 'next-intl';

function LoginFormContent() {
  const t = useTranslations('Login');

  const formSchema = z.object({
    email: z
      .email(t('email.validation.invalid'))
      .min(1, t('email.validation.required')),
    password: z.string().min(1, t('password.validation.required')),
  });

  type FormValues = z.infer<typeof formSchema>;

  const { signIn, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show success message if coming from verification
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'verification_success') {
      toast.success('Xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.');
    }
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      const success = await signIn(values.email, values.password);

      if (success) {
        toast.success(t('success.title'), {
          description: t('success.message'),
        });
        router.push('/');
      } else {
        toast.error(t('failed.title'), {
          description: t('failed.message'),
        });
        setError('email', {
          type: 'server',
          message: 'Email hoặc mật khẩu không đúng',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <Input
                  {...field}
                  id='email'
                  type='email'
                  placeholder={t('email.placeholder')}
                  disabled={isSubmitting}
                  className='w-full -px-3 py-8 adam-store-bg rounded-none border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none focus-visible:border-b-2 focus-visible:shadow-none focus-visible:ring-offset-0'
                />
              </FormControl>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <Mail className='text-gray-500 size-5' />
              </span>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <PasswordInput
                  {...field}
                  id='password'
                  placeholder={t('password.placeholder')}
                  disabled={isSubmitting}
                  className='w-full -px-3 py-8 adam-store-bg rounded-none border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none focus-visible:border-b-2 focus-visible:ring-offset-0 focus-visible:shadow-none'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-1 mt-8 flex justify-between'>
          <Button
            type='submit'
            disabled={isSubmitting || isLoading}
            className='w-fit bg-foreground cursor-pointer hover:bg-foreground/80 text-secondary py-2 px-4 rounded-md font-medium'
          >
            {isSubmitting ? t('action.loading') : t('action.login')}
          </Button>

          <div className='text-center'>
            <Link
              href='/forgot_password'
              className='text-sm text-primary hover:underline'
            >
              {t('forgotPassword')}
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
