import { ContentBestSeller } from '@/components/templates/(marketing)/best-seller/BestSeller';
import { pageMetadataPresets } from '@/lib/metadata';
import { useTranslations } from 'next-intl';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  return pageMetadataPresets.bestSeller(locale);
}

export default function BestSellerPage() {
  const t = useTranslations('Marketing');
  return (
    <div className='w-full !p-6'>
      <h1 className='font-bold text-3xl text-center'>
        {t('bestSellers.title')}
      </h1>
      <div className='h-full w-full'>
        <ContentBestSeller />
      </div>
    </div>
  );
}
