import SideCategory from '@/components/templates/(marketing)/detail/SideCategory';
import { ContentCategory } from '@/components/templates/(marketing)/detail/ContentCategory';
import { pageMetadataPresets, createPageMetadata } from '@/lib/metadata';
import { getAllCategoriesAction } from '@/actions/categoryActions';

type Props = {
  params: { locale: string };
  searchParams: { category?: string };
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categoryId } = await searchParams;

  try {
    // Fetch categories để tìm category name
    const response = await getAllCategoriesAction();
    const categories = response.data || [];

    // Tìm category theo ID
    const selectedCategory = categories.find(
      (cat) => cat.id.toString() === categoryId
    );

    if (selectedCategory) {
      // Sử dụng category preset với data thực tế
      return pageMetadataPresets.category(
        locale,
        selectedCategory.name,
        selectedCategory.id.toString()
      );
    } else {
      // Category không tồn tại
      return createPageMetadata({
        title:
          locale === 'vi' ? 'Danh Mục Không Tồn Tại' : 'Category Not Found',
        description:
          locale === 'vi'
            ? 'Danh mục sản phẩm bạn đang tìm kiếm không tồn tại. Vui lòng chọn danh mục khác.'
            : 'The product category you are looking for does not exist. Please choose another category.',
        noIndex: true, // Không index trang lỗi
        canonical: `/${locale}/detail?category=${categoryId}`,
      });
    }
  } catch (error) {
    console.error('Error fetching categories for metadata:', error);

    // Fallback metadata khi có lỗi
    return createPageMetadata({
      title: locale === 'vi' ? 'Sản Phẩm' : 'Products',
      description:
        locale === 'vi'
          ? 'Khám phá sản phẩm thời trang nam tại Adam Store.'
          : "Explore men's fashion products at Adam Store.",
      canonical: `/${locale}/detail`,
    });
  }
}

export default function AoPoloStore() {
  return (
    <div className='md:flex w-full'>
      <div className='h-full w-full md:w-[17%]'>
        <SideCategory />
      </div>
      <div className='h-full w-full md:w-[83%] px-4'>
        <ContentCategory />
      </div>
    </div>
  );
}
