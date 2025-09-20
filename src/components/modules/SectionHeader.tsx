import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { notoSans } from '@/config/fonts';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SectionHeader({
  title,
  description,
  className,
  hasButton,
  to,
}: {
  title: string;
  description?: string;
  className?: string;
  hasButton: boolean;
  to: string;
}) {
  const t = useTranslations('Marketing');

  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-secondary py-6 dark:border-secondary-dark',
        className
      )}
    >
      <div>
        {description ? (
          <p
            className={cn(
              'text-sm bg-blac text-gray-700 dark:text-gray-300 sm:text-base'
            )}
          >
            {description}
          </p>
        ) : null}

        <h2 className={cn('text-xl font-bold sm:text-3xl', notoSans.className)}>
          {title}
        </h2>
      </div>
      {hasButton ? (
        <Link href={to}>
          <Button variant='default'> {t('sectionHeader.allProducts')} </Button>
        </Link>
      ) : null}
    </div>
  );
}
