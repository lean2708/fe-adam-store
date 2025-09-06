import Link from 'next/link';
import { Modal } from '@/components/ui/modal';
import { getAllCategoriesAction } from '@/actions/categoryActions';
import { TCategory } from '@/types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('Sidebar');

  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategoriesAction();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant='sidebar'
      size='sm'
      position='left'
      showOverlay={true}
      className='adam-store-bg-light'
    >
      <div className='p-4'>
        {/* Close Button */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg font-medium text-primary'>
            {t('categories')}
          </h2>
          <div className='w-10'></div>
        </div>

        {/* Main Navigation */}
        <nav className='space-y-1'>
          {loading ? (
            <div className='text-center py-8'>
              <Skeleton className='h-8 w-[70%]' />
            </div>
          ) : categories.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>Không có danh mục nào.</p>
            </div>
          ) : (
            <>
              <Link
                href='/best-seller'
                className='block py-4 px-2 text-primary font-medium border-b border-border hover:bg-secondary/50 rounded-t-xl'
                onClick={onClose}
              >
                {t('best_seller')}
              </Link>
              <Link
                href='/news'
                className='block py-4 px-2 text-primary font-medium border-b border-border hover:bg-secondary/50 rounded-t-xl'
                onClick={onClose}
              >
                {t('new_product')}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id || category.name}
                  href={`/detail?category=${category.id}`}
                  className='block py-4 px-2 text-primary font-medium border-b border-border hover:bg-secondary/50 rounded-t-xl'
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer Links */}
        <div className='pt-6 border-t border-border'>
          <nav className='space-y-4'>
            <Link
              href='/about-us'
              className='block py-2 px-2 text-muted-foreground text-sm hover:text-gray-700 dark:hover:text-gray-100'
              onClick={onClose}
            >
              {t('about_us')}
            </Link>

            <Link
              href='/store-location'
              className='block py-2 px-2 text-muted-foreground text-sm hover:text-gray-700 dark:hover:text-gray-100'
              onClick={onClose}
            >
              {t('store_location')}
            </Link>
          </nav>
        </div>
      </div>
    </Modal>
  );
}
