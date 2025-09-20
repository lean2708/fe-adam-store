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
    <button
      onClick={onRemoveItem}
      className={cn(
        'flex justify-center items-center group',
        isChanged || isQuantityUpdating ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={isChanged || isQuantityUpdating}
    >
      <Trash2 className='  size-5 mr-1 text-muted-foreground group-hover:text-destructive' />
      {textDisplay && (
        <span className='  text-muted-foreground font-medium group-hover:text-destructive group-hover:underline'>
          {t('cart.remove')}
        </span>
      )}
      {/* <span className='  text-muted-foreground font-medium group-hover:text-destructive group-hover:underline'>
        {t('cart.remove')}
      </span> */}
    </button>
  );
};

export default ButtonDel;
