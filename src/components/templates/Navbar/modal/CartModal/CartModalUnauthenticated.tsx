import { Modal, ModalBody } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { manrope } from '@/config/fonts';

interface UnauthenticatedModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CartModalUnauthenticated({
  open,
  onClose,
}: UnauthenticatedModalProps) {
  const router = useRouter();
  const t = useTranslations('Auth');

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant='dropdown'
      size='md'
      position='top-right'
      showOverlay={true}
    >
      <ModalBody
        className={cn(
          'bg-background max-h-[70vh] flex flex-col items-center justify-center py-8',
          manrope.className
        )}
      >
        <div className='text-lg font-semibold mb-2'>
          {t('unauthenticated.title')}
        </div>
        <div className='text-sm text-muted-foreground mb-6 text-center'>
          {t('unauthenticated.message')}
        </div>
        <Button
          variant='default'
          className='w-full py-3 rounded-md font-medium'
          onClick={() => {
            router.push('/login');
            onClose();
          }}
        >
          {t('unauthenticated.login')}
        </Button>
      </ModalBody>
    </Modal>
  );
}
