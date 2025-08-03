import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ProductDescription() {
  const t = useTranslations('Marketing.product_details');

  const [showDescription, setShowDescription] = useState(false);

  return (
    <div>
      <div className='text-xl font-bold text-primary space-y-1 flex items-center'>
        <p className='mr-2'>{t('product_infor.desc')}</p>
        <button
          onClick={() => setShowDescription((prev) => !prev)}
          className='w-6 h-6 text-black flex items-center justify-center border border-gray-300 rounded-full bg-white hover:bg-gray-100 transition'
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
              Hạn chế sử dụng máy sấy và ủi (nếu có) chỉ nên ủi lên vải hoặc sử
              dụng bàn ủi hơi nước ở nhiệt độ thích hợp.
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
              Bạn vui lòng gửi cho chúng mình clip đóng gói và hình ảnh của đơn
              hàng đổi trả của bạn, nhân viên tư vấn sẽ xác nhận và tiến hành
              lên đơn đổi trả cho bạn.
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
  );
}
