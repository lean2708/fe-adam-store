import { AspectRatio } from '@/components/ui/aspect-ratio';
import { manrope } from '@/config/fonts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const page = () => {
  return (
    <section className={cn('bg-background', manrope.className)}>
      <article>
        <h1 className='text-3xl md:text-4xl xl:text-5xl font-semibold text-primary text-center my-12'>
          Câu chuyện về Adam Store
        </h1>
        <main className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-4 my-8'>
          <AspectRatio ratio={16 / 9} className='w-full h-full rounded-md'>
            <Image
              src={'/imgs/about_us.jpg'}
              alt='Adam Store - thời trang nam lịch lãm'
              width={300}
              height={400}
              className='w-full h-full object-cover transition-opacity duration-300 rounded-md'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
            />
          </AspectRatio>
          <div>
            <p className='mb-4'>
              Trong quan niệm của Adam Store, việc lựa chọn phục trang cũng
              giống như việc lấp đầy những vùng trống và hoàn thiện bức tự họa
              của phong cách. Nâng tầm thời trang thanh lịch và tinh tế, chúng
              tôi tin rằng việc chú trọng thêm thắt từng họa tiết, cấu trúc có
              tính toán là cốt lõi tạo ra những sản phẩm mang tính ứng dụng cao
              và đậm giá trị thẩm mỹ.
            </p>
            <p className='mb-4'>
              Adam Store mang hơi thở tuổi trẻ và thổi vào từng phong cách thiết
              kế là mỗi concept, câu chuyện mang chủ đề riêng của trang phục.
              Hiểu được ý nghĩa của thời trang bạn đang vận lên người chính là
              chiến lược sáng giá để bạn tự tin bật lên những gì “chất” nhất,
              “độc” nhất của bản thân mình.
            </p>
            <p>
              Là những người theo chủ nghĩa duy mỹ, Adam Store luôn mong muốn
              mang lại cho người dùng những sản phẩm đẹp mắt, hợp xu hướng và
              chất lượng. Tất cả các sản phẩm của Adam Store đều được tự thiết
              kế và sản xuất.
            </p>
          </div>
        </main>
      </article>
    </section>
  );
};

export default page;
