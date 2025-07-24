import { useRef, useEffect } from "react"
import { User, ShoppingBag } from "lucide-react"

export default function UserModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={modalRef}
      style={{
        position: "absolute",
        width: "338px",
        minHeight: "224px",
        top: "40px",
        right: "25px",
        borderRadius: "8px",
        padding: "16px",
        zIndex: 9999,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
      className="border border-gray-200"
    >
      <div className="flex items-center h-16 rounded-2xl gap-3 hover:bg-gray-50 transition">
        <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <span className="text-lg font-medium">Thông tin tài khoản</span>
      </div>
      <div className="flex items-center h-16 rounded-2xl gap-3 hover:bg-gray-50 transition">
        <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center ">
          <ShoppingBag className="h-6 w-6 text-gray-400" />
        </div>
        <span className="text-lg font-medium">Đơn hàng của tôi</span>
      </div>
      <div className="flex items-center h-16 rounded-2xl gap-3 hover:bg-gray-50 transition">
        <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24"><path d="M9 16l-4-4m0 0l4-4m-4 4h12"></path></svg>
        </div>
        <span className="text-lg font-medium">Đăng xuất</span>
      </div>
    </div>
  )
}
