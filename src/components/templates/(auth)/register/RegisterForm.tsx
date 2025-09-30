'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Mail, User } from 'lucide-react';
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
import { signUpAction } from '@/actions/nextAuthActions';
import { PasswordInput } from '@/components/modules/PasswordInput';
import { useTranslations } from 'next-intl';

export default function RegisterForm() {
  const t = useTranslations('Register');
  const router = useRouter();

  // Schema validation
  const formSchema = z
    .object({
      name: z.string().min(1, t('name.validation.required')),
      email: z
        .email(t('email.validation.invalid'))
        .min(1, t('email.validation.required')),
      password: z
        .string()
        .min(6, t('password.validation.minLength', { length: 6 })),
      confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('confirmPassword.validation.mismatch'),
      path: ['confirmPassword'],
    });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    setError,
  } = form;

  // TODO: Thay thế bằng action thực tế khi có API đăng ký
  const onSubmit = async (values: FormValues) => {
    // Giả lập gọi API
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);

    const res = await signUpAction(formData);

    if (res.success && res.data) {
      toast.success(`${res.message}`);

      router.push(
        `/register/verify?email=${encodeURIComponent(res.data.email ?? '')}`
      );
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
      toast.error(res.message || t('failed.title'), {
        description: t('failed.message'),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <Input
                  {...field}
                  id='name'
                  type='text'
                  placeholder={t('name.placeholder')}
                  disabled={isSubmitting}
                  className='w-full -px-3 py-8 adam-store-bg rounded-none border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none focus-visible:border-b-2 focus-visible:ring-offset-0 focus-visible:shadow-none'
                />
              </FormControl>
              <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <User className='text-gray-500 size-5' />
              </span>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  className='w-full -px-3 py-8 adam-store-bg rounded-none border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none focus-visible:border-b-2 focus-visible:ring-offset-0 focus-visible:shadow-none'
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

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <PasswordInput
                  {...field}
                  id='confirmPassword'
                  placeholder={t('confirmPassword.placeholder')}
                  disabled={isSubmitting}
                  className='w-full -px-3 py-8 adam-store-bg rounded-none border-b-1 border-t-0 border-l-0 border-r-0 border-b-gray-300 shadow-none focus-visible:border-b-2 focus-visible:ring-offset-0 focus-visible:shadow-none'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='gap-4 sm:gap-2 mt-8 flex flex-col sm:flex-row justify-between items-center sm:items-start'>
          <Button
            type='submit'
            disabled={isSubmitting || !isDirty}
            className='w-52 sm:w-fit h-10 bg-foreground cursor-pointer hover:bg-foreground/80 text-secondary py-2 px-10 mb-4 rounded-md font-medium'
          >
            {isSubmitting ? t('action.loading') : t('action.register')}
          </Button>

          <div className='text-center'>
            {t('haveAccount')}{' '}
            <Link
              href='/login'
              className='text-sm text-primary hover:underline text-center sm:text-start'
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
