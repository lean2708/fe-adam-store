'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordAction } from '@/actions/nextAuthActions';
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

export default function ResetPasswordForm() {
  const t = useTranslations('Forgot_password');
  const router = useRouter();

  const formSchema = z
    .object({
      password: z
        .string()
        .min(6, t('new_password.validation.minLength', { length: 6 })),
      confirmPassword: z.string().min(1, t('new_password.validation.required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('confirm_new_password.validation.mismatch'),
      path: ['confirmPassword'],
    });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);

    const res = await resetPasswordAction(formData);

    if (res.success) {
      toast.success(`${res.message}`);
      router.push('/login');
    } else {
      // Nếu có lỗi field cụ thể từ backend, setError cho từng field
      if (res.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : String(messages),
          });
        });
      }
      toast.error(`${res.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <PasswordInput
                  {...field}
                  id='password'
                  placeholder={t('new_password.placeholder')}
                  disabled={isSubmitting}
                  className='w-full -px-3 py-8 adam-store-bg rounded-none border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none focus-visible:border-b-2 focus-visible:ring-offset-0 focus-visible:shadow-none'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <PasswordInput
                  {...field}
                  id='confirmPassword'
                  placeholder={t('confirm_new_password.placeholder')}
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
            disabled={isSubmitting}
            className='w-fit bg-foreground cursor-pointer hover:bg-foreground/80 text-secondary py-2 px-4 rounded-md font-medium'
          >
            {isSubmitting ? t('action.reset.loading') : t('action.reset.reset')}
          </Button>

          <div className='text-center'>
            <Link
              href='/login'
              className='text-sm text-primary hover:underline'
            >
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
