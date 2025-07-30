export default function OrderItem(props: any) {
  const { item } = props
  return (
    <div className="py-3 border-b-2 flex w-full justify-between h-24 items-center">
      <div className="h-16 w-auto flex">
        <img className="h-16 w-16" src={item.image.imageUrl} alt={item.productVariant.product.name} />
        <div className="ml-3 flex flex-col justify-between">
          <h4>{item.productVariant.product.name}</h4>
          <p className="text-gray-500">Size: {item.productVariant.color.name} - Màu sắc: {item.productVariant.size.name}</p>
        </div>
      </div>
      <div>
       <p className="text-gray-500 text-end">Số lượng: {item.quantity}</p>
       <p className="text-end">{item.unitPrice} VNĐ</p>
       <p>Tổng số tiền ({item} sản phẩm): <b>{item.quantity*item.unitPrice} VNĐ</b></p>
      </div>
    </div>
  )
}
