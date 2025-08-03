import { formatCurrency } from "@/lib/utils"
type TabStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export default function OrderItem(props: { activeStatus: TabStatus, item: any , openModule: (type: string)=> void}) {
  const btnByStatus: Record<TabStatus, React.ReactNode> = {
    PENDING: <><button onClick={()=>openModule('address')} className='w-52 px-4 mr-4 py-2 rounded-md border border-black text-sm'>Thay đổi địa chỉ nhận hàng</button><button className='w-40 px-4 py-2 bg-black text-white rounded-md text-sm'>Hủy</button></>,
    PROCESSING: <><button onClick={()=>openModule('address')} className='w-52 px-4 mr-4 py-2 rounded-md border border-black text-sm'>Thay đổi địa chỉ nhận hàng</button><button className='w-40 px-4 py-2 bg-black text-white rounded-md text-sm'>Hủy</button></>,
    SHIPPED: <><button className='w-56 text-gray-400 px-4 py-2 rounded-md border border-gray-400 text-sm'>Xác nhận đã nhận được đơn</button></>,
    DELIVERED: <><button  onClick={()=>openModule('review')} className='w-28 px-4 py-2 bg-black text-white rounded-md text-sm'>Đánh giá</button></>,
    CANCELLED: <><button className='w-28 px-4 py-2 bg-black text-white rounded-md text-sm'>Mua lại</button></>
  }
  const { item, activeStatus, openModule } = props
  return (
    <>
      <div className="py-3 flex w-full justify-between h-20 items-center">
        <div className="h-16 w-auto flex">
          <img className="h-16 w-16" src={item.image.imageUrl} alt={item.productVariant.product.name} />
          <div className="ml-3 flex flex-col justify-between">
            <h4 className="text-lg">{item.productVariant.product.name}</h4>
            <p className="text-gray-500">Size: {item.productVariant.color.name} - Màu sắc: {item.productVariant.size.name}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-end">Số lượng: {item.quantity}</p>
          <p className="text-end">{formatCurrency(item.unitPrice)}</p>
          <p>Tổng số tiền ({item.quantity} sản phẩm): <b>{formatCurrency(item.unitPrice * item.quantity)}</b></p>
        </div>

      </div>
      <div className='py-2 text-end'>
        {btnByStatus[activeStatus]}
      </div>
    </>

  )
}
