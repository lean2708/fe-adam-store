'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const decoded = query ? decodeURIComponent(query) : '';
  const updateQuery = (key: string, value?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'desc') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div className='w-full h-24 px-8 flex justify-between items-center'>
      <div>
        <p className='text-[#888888] font-extrabold'>Kết quả tìm kiếm</p>
        <h3 className='text-3xl mt-1 font-bold'>{decoded}</h3>
      </div>
      <div>
        <span className='text-[#888888]'>Sắp xếp theo</span>
        <select
          className='outline-none ml-2 adam-store-bg-light'
          value={searchParams.get('sort') || 'desc'}
          onChange={(e) => {
            console.log(e.target.value);
            const newValue = e.target.value;
            updateQuery('sort', newValue);
          }}
          name='sort'
          id='sort'
        >
          <option value='asc'>Giá tăng dần</option>
          <option value='desc'>Giá giảm dần</option>
        </select>
      </div>
    </div>
  );
}
