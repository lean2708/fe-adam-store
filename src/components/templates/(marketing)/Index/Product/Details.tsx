'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function Details() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [showDescription, setShowDescription] = useState(false);
  const [selectedColor, setSelectedColor] = useState('white');
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <div className='space-y-6'>
      {/* Product Info */}
      <div className='space-y-1'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-primary '>
          Slim-Fit Stretch-Cotton Poplin Fabric Overshirt
        </h1>
        <div className='flex gap-2'>
          <Star className=' size-5 fill-amber-300 text-amber-200' />{' '}
          <span> 5.0</span>
          <span className='text-gray-400 ml-4'>Đã bán: 22</span>
        </div>
        {/* <p className='text-[#757575] mb-4'>SKU: AOS-001</p> */}
        <div className='text-xl md:text-2xl lg:text-3xl font-bold text-primary'>
          450.000 ₫
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className='block text-sm font-medium text-[#262626] mb-2'>
          Màu sắc:
        </label>
        <div className='flex gap-2'>
          <button
            onClick={() => setSelectedColor('white')}
            className={` bg-white border-2  ${
              selectedColor === 'white'
                ? 'border-[#0e3bac]'
                : 'border-[#e0e0e0]'
            }`}
            style={{
              width: '50px',
              height: '29px',
              borderRadius: '100px',
              opacity: 1,
            }}
          />
          <button
            onClick={() => setSelectedColor('black')}
            className={` bg-[#262626] border-2  ${
              selectedColor === 'black' ? 'border-red-500' : 'border-[#0e3bac]'
            }`}
            style={{
              width: '50px',
              height: '29px',
              borderRadius: '100px',
              opacity: 1,
            }}
          />
          <button
            onClick={() => setSelectedColor('blue')}
            className={` bg-blue-700 border-2  ${
              selectedColor === 'blue' ? 'border-[#0e3bac]' : 'border-[#e0e0e0]'
            }`}
            style={{
              width: '50px',
              height: '29px',
              borderRadius: '100px',
              opacity: 1,
            }}
          />
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className='block text-sm font-medium text-[#262626] mb-2'>
          Size:
        </label>
        <div className='flex gap-2'>
          <button className='w-14 h-fit px-2 sm:px-3 py-1 text-xl text-center font-extralight bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200 hover:border-gray-300 shadow-sm'>
            M
          </button>
          <button className='w-14 h-fit px-2 sm:px-3 py-1 text-xl text-center font-extralight bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200 hover:border-gray-300 shadow-sm'>
            L
          </button>
          <button className='w-14 h-fit px-2 sm:px-3 py-1 text-xl text-center font-extralight bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200 hover:border-gray-300 shadow-sm'>
            XL
          </button>
          <button className='w-14 h-fit px-2 sm:px-3 py-1 text-xl text-center font-extralight bg-gray-100 text-gray-400 rounded-full line-through cursor-not-allowed border border-gray-200 opacity-60'>
            2XL
          </button>
          <button className='w-14 h-fit px-2 sm:px-3 py-1 text-xl text-center font-extralight bg-gray-100 text-gray-400 rounded-full line-through cursor-not-allowed border border-gray-200 opacity-60'>
            3XL
          </button>
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className='block text-sm font-medium text-[#262626] mb-2'>
          Số lượng:
        </label>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleQuantityChange(-1)}
            className='w-8 h-8 border border-[#e0e0e0] rounded flex items-center justify-center hover:bg-[#e8e8e8]'
          >
            -
          </button>
          <span className='w-12 text-center'>{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className='w-8 h-8 border border-[#e0e0e0] rounded flex items-center justify-center hover:bg-[#e8e8e8]'
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-2'>
        <Button className='px-10 py-3 rounded-md font-semibold text-white bg-neutral-800 hover:bg-neutral-700'>
          Thêm vào giỏ hàng
        </Button>
        <Button className='px-10 py-3 rounded-md font-semibold text-white bg-blue-800 hover:bg-blue-700'>
          Mua Ngay
        </Button>
      </div>

      {/* Additional Info */}
      <div>
        <div className='text-xl font-bold text-primary space-y-1 flex items-center'>
          <p className='mr-2'>Mô tả sản phẩm</p>
          <button
            onClick={() => setShowDescription((prev) => !prev)}
            className='w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full bg-white hover:bg-gray-100 transition'
            aria-label={showDescription ? 'Thu gọn' : 'Mở rộng'}
          >
            {showDescription ? '-' : '+'}
          </button>
        </div>
        {showDescription && (
          <div className='text-base text-primary mt-2'>
            <h1>Thông tin sản phẩm và chính sách</h1>

            <h2>Chất liệu</h2>
            <ul className='list-disc pl-4'>
              <li>Vải poly 2 da</li>
            </ul>

            <h2>Hướng dẫn bảo quản sản phẩm</h2>
            <ul className='list-disc pl-4'>
              <li>Giặt ở nhiệt độ bình thường, với đồ có màu tương tự.</li>
              <li>Không dùng hóa chất tẩy lên sản phẩm.</li>
              <li>Nên giặt tay và **LỘN NGƯỢC ÁO** trước khi giặt.</li>
              <li>Không ủi trực tiếp lên hình in.</li>
              <li>
                Hạn chế sử dụng máy sấy và ủi (nếu có) chỉ nên ủi lên vải hoặc
                sử dụng bàn ủi hơi nước ở nhiệt độ thích hợp.
              </li>
            </ul>

            <h2>Chính sách đổi sản phẩm</h2>
            <h3>1. Điều kiện đổi hàng</h3>
            <ul className='list-disc pl-4'>
              <li>Bạn lưu ý giữ lại hóa đơn để đổi hàng trong vòng 30 ngày.</li>
              <li>
                Đối với mặt hàng giảm giá, phụ kiện cá nhân (áo lót, khẩu trang,
                vớ...) không nhận đổi hàng.
              </li>
              <li>
                Tất cả sản phẩm đã mua sẽ không được đổi trả lại bằng tiền mặt.
              </li>
              <li>
                Bạn có thể đổi size hoặc sản phẩm khác trong 30 ngày (Lưu ý: sản
                phẩm chưa qua sử dụng, còn tag nhãn và hóa đơn mua hàng).
              </li>
              <li>
                Bạn vui lòng gửi cho chúng mình clip đóng gói và hình ảnh của
                đơn hàng đổi trả của bạn, nhân viên tư vấn sẽ xác nhận và tiến
                hành lên đơn đổi trả cho bạn.
              </li>
            </ul>

            <h3>2. Trường hợp khiếu nại</h3>
            <ul className='list-disc pl-4'>
              <li>Bạn phải có video unbox hàng.</li>
              <li>Quay video rõ nét 6 mặt của gói hàng.</li>
              <li>Quay rõ: Tên người nhận, mã đơn, địa chỉ, số điện thoại.</li>
              <li>Clip không cắt ghép, chỉnh sửa.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
