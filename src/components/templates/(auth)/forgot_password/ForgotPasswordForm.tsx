'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordAction } from '@/actions/nextAuthActions';
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
import { useTranslations } from 'next-intl';

export default function ForgotPasswordForm() {
  const t = useTranslations('Forgot_password');
  const router = useRouter();

  const formSchema = z.object({
    email: z
      .email(t('email.validation.invalid'))
      .min(1, t('email.validation.required')),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append('email', values.email);

    const res = await forgotPasswordAction(formData);

    if (res.success) {
      toast.success(`${res.message}`);

      router.push('/forgot_password/verify_code');
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

        <div className='gap-6 sm:gap-2 mt-8 flex flex-col-reverse sm:flex-row justify-between items-center'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-52 h-10 sm:w-fit bg-foreground cursor-pointer hover:bg-foreground/80 text-secondary py-2 px-10 rounded-md font-medium self-center'
          >
            {isSubmitting ? t('action.email.loading') : t('action.email.send')}
          </Button>

          <div className='text-center self-end sm:self-baseline'>
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
