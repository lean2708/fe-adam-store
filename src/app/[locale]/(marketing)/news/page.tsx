import { ContentNews } from '@/components/templates/(marketing)/news/ContentNew';
import { pageMetadataPresets } from '@/lib/metadata';
import { useTranslations } from 'next-intl';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  return pageMetadataPresets.news(locale);
}

export default function NewsPage() {
  const t = useTranslations('Marketing');
  return (
    <div className='w-full py-6 px-4'>
      <h1 className='font-bold text-3xl text-center'>
        {t('newestProducts.title')}
      </h1>
      <div className='h-full w-full'>
        <ContentNews />
      </div>
    </div>
  );
}
