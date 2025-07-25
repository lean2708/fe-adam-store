'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
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
import { useAuthStore } from '@/stores/authStore';
import {
  clearPendingEmail,
  verifyRegistrationAction,
} from '@/actions/authActions';

// Schema validation
const formSchema = z.object({
  verifyCodeRequest: z.string().min(1, 'Mã xác thực là bắt buộc'),
});

type FormValues = z.infer<typeof formSchema>;

export default function VerifyForm({ email }: { email: string }) {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verifyCodeRequest: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  // TODO: Thay thế bằng action thực tế khi có API đăng ký
  const onSubmit = async (values: FormValues) => {
    // Giả lập gọi API
    const formData = new FormData();

    formData.append('verifyCodeRequest', values.verifyCodeRequest);

    const res = await verifyRegistrationAction(email, formData);

    if (res.success) {
      toast.success(`${res.message}`);

      if (res.data) {
        signIn(res.data);
        await clearPendingEmail();
      }
      router.push('/');
    } else {
      // Xử lý lỗi từng field nếu có
      if (res.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : String(messages),
          });
        });
      }
      toast.error(res.message || 'Xác thực thất bại');
      // Registration successful, but failed to obtain tokens for login
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='verifyCodeRequest'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <Input
                  {...field}
                  id='name'
                  type='text'
                  placeholder='Nhập mã xác thực'
                  disabled={isSubmitting}
                  className='w-full -px-3 py-8 rounded-none border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none focus-visible:border-b-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none'
                />
              </FormControl>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <Lock className='text-gray-500 size-5' />
              </span>
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
            {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
          </Button>

          <div className='text-center'>
            Bạn đã có tài khoản?{' '}
            <Link
              href='/login'
              className='text-sm text-primary hover:underline'
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
