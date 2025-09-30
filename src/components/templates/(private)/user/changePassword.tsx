import { changePasswordAction } from '@/actions/userActions';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ChangePassword() {
  const t = useTranslations('Profile.change_password');

  const [newPass, setNewPass] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [eye, setEye] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);
  const submitChangePassword = async () => {
    if (newPass.newPassword !== newPass.confirmPassword) {
      toast.warning(t('missmatch.title'));
      return;
    }
    if (newPass.oldPassword === newPass.newPassword) {
      toast.warning(t('same_password.title'));
      return;
    }
    if (
      newPass.oldPassword === '' ||
      newPass.newPassword === '' ||
      newPass.confirmPassword === ''
    ) {
      toast.warning(t('empty_field.title'));
    }
    try {
      const res = await changePasswordAction(newPass);
      if (res.success) {
        toast.success(res.message || t('success.title'));
        setNewPass({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(res.message || t('error.title'));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='adam-store-bg mt-8 w-full h-90 md:border-2 border-primary md:rounded-lg md:shadow'>
      <ul className='w-full mt-8 md:px-15'>
        <li className='w-full gap-2 flex flex-col md:flex-row justify-between my-6 items-start md:items-center h-full md:h-13'>
          <label htmlFor='current-password' className='font-semibold w-1/2'>
            {t('current_password.label')}:
          </label>
          <div className='relative w-full h-full'>
            <input
              id='current-password'
              onChange={(e) =>
                setNewPass({ ...newPass, oldPassword: e.target.value })
              }
              value={newPass.oldPassword}
              className='border border-border py-5 pl-3 pr-10 rounded-lg w-full h-full font-semibold text-muted-foreground outline-none'
              type={eye.oldPassword ? 'text' : 'password'}
              placeholder={t('current_password.placeholder')}
            />
            <button
              aria-label='Toggle Password Visibility'
              className='absolute inset-y-0 right-0 flex items-center px-2 py-2 outline-none text-muted-foreground'
              onClick={() => setEye({ ...eye, oldPassword: !eye.oldPassword })}
            >
              {eye.oldPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </li>
        <li className='w-full gap-2 flex flex-col md:flex-row justify-between my-6 items-start md:items-center h-full md:h-13'>
          <label htmlFor='new-password' className='font-semibold w-1/2'>
            {t('new_password.label')}:
          </label>
          <div className='relative w-full h-full'>
            <input
              id='new-password'
              onChange={(e) =>
                setNewPass({ ...newPass, newPassword: e.target.value })
              }
              value={newPass.newPassword}
              className='border border-border py-5 pl-3 pr-10 rounded-lg w-full h-full font-semibold text-muted-foreground outline-none'
              type={eye.newPassword ? 'text' : 'password'}
              placeholder={t('new_password.placeholder')}
            />
            <button
              aria-label='Toggle Password Visibility'
              className='absolute inset-y-0 right-0 flex items-center px-2 py-2 outline-none text-muted-foreground'
              onClick={() => setEye({ ...eye, oldPassword: !eye.oldPassword })}
            >
              {eye.oldPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </li>
        <li className='w-full gap-2 flex flex-col md:flex-row justify-between my-6 items-start md:items-center h-full md:h-13'>
          <label htmlFor='confirm-new-password' className='font-semibold w-1/2'>
            {t('confirm_new_password.label')}:
          </label>
          <div className='relative w-full h-full'>
            <input
              id='confirm-new-password'
              onChange={(e) =>
                setNewPass({ ...newPass, confirmPassword: e.target.value })
              }
              value={newPass.confirmPassword}
              className='border border-border py-5 pl-3 pr-10 rounded-lg w-full h-full font-semibold text-muted-foreground outline-none'
              type={eye.confirmPassword ? 'text' : 'password'}
              placeholder={t('confirm_new_password.placeholder')}
            />
            <button
              aria-label='Toggle Password Visibility'
              className='absolute inset-y-0 right-0 flex items-center px-2 py-2 outline-none text-muted-foreground'
              onClick={() => setEye({ ...eye, oldPassword: !eye.oldPassword })}
            >
              {eye.oldPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </li>
      </ul>
      <div className='w-full text-center mt-10 md:mt-7'>
        <Button
          className='py-6 px-8 font-medium rounded-xl'
          onClick={submitChangePassword}
        >
          {t('action.save')}
        </Button>
      </div>
    </div>
  );
}
