import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import { Modal, ModalBody } from "@/components/ui/modal"

type CartItem = {
  id: number
  name: string
  color: string
  size: string
  price: number
  quantity: number
  image: string
}

export default function CartModal({
  open,
  cartItems,
  onClose,
}: {
  open: boolean
  cartItems: CartItem[]
  onClose: () => void
}) {

  // Calculate totals inside the modal
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (

    <Modal
      open={open}
      onClose={onClose}
      variant="dropdown"
      size="md"
      position="top-right"
      showOverlay={true}
    >
      <ModalBody>
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Tạm tính: <span className="font-semibold">{cartTotal.toLocaleString("vi-VN")} VND</span> (
            {cartItemCount} sản phẩm)
          </div>
          <div className="text-sm font-medium">Đã Chọn-{cartItemCount}</div>
        </div>
        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-2 border-b border-gray-100">
              <div className="flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                <p className="text-xs text-gray-500">
                  {item.color}/ {item.size}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.price.toLocaleString("vi-VN")} VND
                  </span>
                  <span className="text-xs text-gray-500">x{item.quantity}</span>
                </div>
              </div>
              <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
        {/* Cart Actions */}
        <div className="space-y-2">
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md font-medium"
            onClick={onClose}
          >
            Mua ngay
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 py-3 rounded-md font-medium bg-transparent"
            onClick={onClose}
          >
            Giỏ hàng của bạn
          </Button>
        </div>

      </ModalBody>
    </Modal>
  )
}
