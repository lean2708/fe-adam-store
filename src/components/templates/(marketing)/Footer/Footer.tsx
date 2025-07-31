import Link from "next/link";
import { MessageCircle, Camera, Users } from "lucide-react";
import { getActiveBranchesAction } from "@/actions/branchActions";
import { TBranch } from "@/types";

export default async function Footer() {
    // Fetch active branches for display, with error handling for static generation
    let branches: TBranch[] = [];
    try {
        const branchesResult = await getActiveBranchesAction();
        branches = branchesResult.success ? (branchesResult.data || []) : [];
    } catch (error) {
        // Silently fail during static generation or when API is unavailable
        console.log("Branches not available during static generation");
        branches = [];
    }
    return (
        <footer
            className="bg-black text-white "
            style={{
                paddingTop: '70px',
                paddingRight: '36px',
                paddingBottom: '70px',
                paddingLeft: '36px',
                opacity: 1
            }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Left Column - Brand */}
                    <div className="lg:col-span-1">
                        <h1 className="text-2xl font-bold mb-4">Adam Store lắng nghe bạn!</h1>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                            Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
                        </p>
                        <button className="bg-white text-black px-6 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                            Đóng góp ý kiến
                        </button>
                    </div>

                    {/* Middle Column - Contact Info */}
                    <div className="lg:col-span-1">
                        <div className="text-right">
                            <div className="mb-4">
                                <p className="text-sm text-gray-300">Hotline: 19001004 446</p>
                                <p className="text-sm text-gray-300">Mon - Fri: 8am - 8pm</p>
                                <p className="text-sm text-gray-300">Sat - Sun: 8am - 1pm</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Social Icons */}
                    <div className="lg:col-span-1">
                        <div className="flex justify-end gap-4">
                            <Link href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                                <Users className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                                <Camera className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* CHÍNH SÁCH */}
                        <div>
                            <h4 className="font-semibold mb-4 text-white">CHÍNH SÁCH</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Chính sách đổi trả
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Chính sách vận chuyển
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Chính sách bảo mật
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Chính sách giao hàng
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* CHĂM SÓC KHÁCH HÀNG */}
                        <div>
                            <h4 className="font-semibold mb-4 text-white">CHĂM SÓC KHÁCH HÀNG</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Trải nghiệm mua sắm 100% hài lòng
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Hỏi đáp - FAQs
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* VỀ ADAM STORE */}
                        <div>
                            <h4 className="font-semibold mb-4 text-white">VỀ ADAM STORE</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Câu chuyện về Adam Store
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* ĐỊA CHỈ CHI NHÁNH */}
                        <div>
                            <h4 className="font-semibold mb-4 text-white">ĐỊA CHỈ CHI NHÁNH</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                {branches.length > 0 ? (
                                    branches.map((branch) => (
                                        <li key={branch.id} className="mb-3">
                                            <div className="font-medium text-white">{branch.name}</div>
                                            <div>{branch.location}</div>
                                            {branch.phone && (
                                                <div className="text-xs text-gray-400">
                                                    Tel: {branch.phone}
                                                </div>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    // Fallback content if no branches are available
                                    <>
                                        <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
                                        <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
                                        <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
                                        <li>132E Nguyễn Thái Học, Phường Bến Thành, Quận 1, HCM</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}