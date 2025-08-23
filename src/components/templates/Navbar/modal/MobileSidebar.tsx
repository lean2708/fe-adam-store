import Link from 'next/link';
import { X } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { getAllCategoriesAction } from '@/actions/categoryActions';
import { TCategory } from '@/types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { log } from 'console';

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
    >
      <div className='p-4'>
        {/* Close Button */}
        <div className='flex justify-between items-center mb-6'>
          <button onClick={onClose} className='p-2'>
            <X className='h-6 w-6 text-gray-600' />
          </button>
          <h2 className='text-lg font-medium text-gray-900'>Danh mục</h2>
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
              <p className='text-gray-500'>Không có danh mục nào.</p>
            </div>
          ) : (
            <>
              <Link
                href='/best-seller'
                className='block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50'
                onClick={onClose}
              >
                Bán chạy nhất
              </Link>
              <Link
                href='/news'
                className='block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50'
                onClick={onClose}
              >
                Sản phẩm mới
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id || category.name}
                  href={`/detail?categoryId=${category.id}`}
                  className='block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50'
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer Links */}
        <div className='pt-6 border-t border-gray-200'>
          <nav className='space-y-4'>
            <Link
              href='/about-us'
              className='block py-2 px-2 text-gray-500 text-sm hover:text-gray-700'
              onClick={onClose}
            >
              Về chúng tôi
            </Link>

            <Link
              href='/store-location'
              className='block py-2 px-2 text-gray-500 text-sm hover:text-gray-700'
              onClick={onClose}
            >
              Cửa hàng
            </Link>
          </nav>
        </div>
      </div>
    </Modal>
  );
}
