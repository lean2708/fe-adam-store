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
    <div className='adam-store-bg mt-8 w-full h-90 border-2 border-primary rounded-lg shadow'>
      <ul className='w-full px-15'>
        <li className='w-full flex justify-between mt-8 items-center h-13 relative'>
          <p className='font-semibold'>{t('current_password.label')}:</p>
          <input
            onChange={(e) =>
              setNewPass({ ...newPass, oldPassword: e.target.value })
            }
            value={newPass.oldPassword}
            className='border border-border pl-3 rounded-lg w-130 h-full font-semibold text-muted-foreground outline-none'
            type={eye.oldPassword ? 'text' : 'password'}
            placeholder={t('current_password.placeholder')}
          />
          <button
            className='px-2 py-2 absolute right-0 outline-none text-muted-foreground'
            onClick={() => setEye({ ...eye, oldPassword: !eye.oldPassword })}
          >
            {eye.oldPassword ? <Eye /> : <EyeOff />}
          </button>{' '}
        </li>
        <li className='w-full flex justify-between mt-8 items-center h-13 relative'>
          <p className='font-semibold'>{t('new_password.label')}:</p>
          <input
            onChange={(e) =>
              setNewPass({ ...newPass, newPassword: e.target.value })
            }
            value={newPass.newPassword}
            className='border border-border text-muted-foreground pl-3 rounded-lg w-130 h-full font-semibold outline-none'
            type={eye.newPassword ? 'text' : 'password'}
            placeholder={t('new_password.placeholder')}
          />
          <button
            className='px-2 py-2 absolute right-0 outline-none text-muted-foreground'
            onClick={() => setEye({ ...eye, newPassword: !eye.newPassword })}
          >
            {eye.newPassword ? <Eye /> : <EyeOff />}
          </button>
        </li>
        <li className='w-full flex justify-between mt-8 items-center h-13 relative'>
          <p className='font-semibold'>{t('confirm_new_password.label')}:</p>
          <input
            onChange={(e) =>
              setNewPass({ ...newPass, confirmPassword: e.target.value })
            }
            value={newPass.confirmPassword}
            className='border border-border text-muted-foreground pl-3 rounded-lg w-130 h-full font-semibold outline-none'
            type={eye.confirmPassword ? 'text' : 'password'}
            placeholder={t('confirm_new_password.placeholder')}
          />
          <button
            className='px-2 py-2 absolute right-0 outline-none text-muted-foreground'
            onClick={() =>
              setEye({ ...eye, confirmPassword: !eye.confirmPassword })
            }
          >
            {eye.confirmPassword ? <Eye /> : <EyeOff />}
          </button>{' '}
        </li>
      </ul>
      <div className='w-full text-center mt-7'>
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
