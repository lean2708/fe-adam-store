import Link from "next/link";

export default function Footer() {
    return (
        <footer className="adam-store-bg-dark text-white mt-16">
            <div className="px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Adam Store</h3>
                        <p className="adam-store-text-light text-sm">
                            Thời trang nam hiện đại, chất lượng cao với phong cách độc đáo.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Sản phẩm</h4>
                        <ul className="space-y-2 text-sm adam-store-text-light">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Áo sơ mi
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Áo khoác
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Quần âu
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Phụ kiện
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm adam-store-text-light">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Hướng dẫn mua hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Bảo hành
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Theo dõi chúng tôi</h4>
                        <ul className="space-y-2 text-sm adam-store-text-light">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Facebook
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Instagram
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Twitter
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    YouTube
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm adam-store-text-light">
                    <p>&copy; 2024 Adam Store. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}