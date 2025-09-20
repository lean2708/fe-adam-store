import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { manrope } from '@/config/fonts';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

type Props = {
  onRemoveItem: () => void;
  isChanged: boolean;
  isQuantityUpdating: boolean;
  textDisplay?: boolean;
  className?: string;
};

const ButtonDel = ({
  onRemoveItem,
  isChanged,
  isQuantityUpdating,
  textDisplay = true,
  className,
}: Props) => {
  const t = useTranslations('Header');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={cn(
            'flex justify-center items-center group',
            isChanged || isQuantityUpdating
              ? 'opacity-50 cursor-not-allowed'
              : '',
            className
          )}
          disabled={isChanged || isQuantityUpdating}
        >
          <Trash2 className='size-5 mr-1 text-muted-foreground group-hover:text-destructive' />
          {textDisplay && (
            <span className='text-muted-foreground font-medium group-hover:text-destructive group-hover:underline'>
              {t('cart.remove')}
            </span>
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn('', manrope.className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('cart.confirm_to_delete')}</AlertDialogTitle>
          <AlertDialogDescription className='hiden'></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cart.action.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onRemoveItem}>
            {t('cart.action.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ButtonDel;
