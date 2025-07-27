import Link from "next/link"
import { X } from "lucide-react"
import { Modal } from "@/components/ui/modal"

export default function MobileSidebar({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            variant="sidebar"
            size="sm"
            position="left"
            showOverlay={true}
        >
            <div className="p-4">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onClose} className="p-2">
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-medium text-gray-900">Danh mục</h2>
                    <div className="w-10"></div>
                </div>
                {/* Footer Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <nav className="space-y-4">
                        <Link
                            href="/about"
                            className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                            onClick={onClose}
                        >
                            Về chúng tôi
                        </Link>
                        <Link
                            href="/policies"
                            className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                            onClick={onClose}
                        >
                            Chính sách
                        </Link>
                        <Link
                            href="/fashion-tips"
                            className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                            onClick={onClose}
                        >
                            Kiến thức mặc đẹp
                        </Link>
                        <Link
                            href="/customer-care"
                            className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                            onClick={onClose}
                        >
                            Chăm sóc khách hàng
                        </Link>
                        <Link
                            href="/stores"
                            className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                            onClick={onClose}
                        >
                            Cửa hàng
                        </Link>
                    </nav>
                </div>
            </div>
        </Modal>
    )
}
