import { notoSans } from '@/config/fonts';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function EmptyCart({ className }: { className?: string }) {
  const t = useTranslations('Header.cart.empty');

  return (
    <div
      className={cn(
        'z-50 my-20 bg-background flex flex-col items-center justify-center border-secondary dark:border-secondary-dark w-full rounded-md border py-16 ',
        className
      )}
    >
      <div className='mb-6'>
        <ShoppingCart className='size-20' />
      </div>
      <p className={cn('text-2xl font-bold mb-2', notoSans.className)}>
        {t('title')}
      </p>
      <p className='text-muted-foreground mb-6 text-center max-w-xs'>
        {t('desc')}
      </p>
      <Link
        href='/'
        className='inline-block px-6 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors'
      >
        {t('action')}
      </Link>
    </div>
  );
}
