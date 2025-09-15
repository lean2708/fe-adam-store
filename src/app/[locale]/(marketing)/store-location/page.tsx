import { getActiveBranchesAction } from '@/actions/branchActions';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { manrope } from '@/config/fonts';
import { cn } from '@/lib/utils';
import { pageMetadataPresets } from '@/lib/metadata';
import { TBranch } from '@/types';
import Image from 'next/image';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return pageMetadataPresets.storeLocation(locale);
}

const page = async () => {
  const res = await getActiveBranchesAction();
  const branches = res.data;

  return (
    <section className={cn('adam-store-bg-light pb-1', manrope.className)}>
      <article className='px-6'>
        <div className='flex flex-col justify-between items-center mb-8'>
          <h1 className='text-3xl md:text-4xl xl:text-5xl font-semibold text-primary text-center my-12'>
            Hệ thống cửa hàng
          </h1>
          <div className='flex items-center justify-between w-full gap-2 text-muted-foreground font-semibold text-base'>
            <span>Bản đồ</span>
            <span>{branches?.length} Cửa Hàng</span>
          </div>
        </div>
        <main className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start  my-8'>
          <AspectRatio ratio={16 / 9} className='w-full h-full rounded-md'>
            <Image
              src={'/imgs/map.png'}
              alt='Adam Store - thời trang nam lịch lãm'
              width={300}
              height={400}
              className='w-full h-full object-cover transition-opacity duration-300 rounded-md'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
            />
          </AspectRatio>

          {/* Store Locations  */}
          <div className='space-y-1 '>
            {branches?.length! > 0 ? (
              branches?.map((branch) => (
                <Card
                  key={branch.id}
                  className='border-border not-last:border-b-2'
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between mb-2'>
                      <h2 className='font-semibold text-primary'>
                        {branch.name}
                      </h2>
                    </div>
                    <p className='text-muted-foreground text-sm mb-1'>
                      {branch.location}
                    </p>
                    <div className='flex items-center gap-2 text-sm'>
                      {/* <span className='text-[#34c759]'>Đang mở</span> */}
                      <span className='text-muted-foreground'>
                        • Đóng cửa vào 22 giờ
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback content if no branches are available
              <>
                <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
                <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
                <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
                <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
              </>
            )}
          </div>
        </main>
      </article>
    </section>
  );
};

export default page;
