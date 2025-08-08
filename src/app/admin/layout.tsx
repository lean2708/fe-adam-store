"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ lấy đường dẫn hiện tại
import "./layout.scss";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 📌 ví dụ: /admin/products

  const navItems = [
    { href: "/admin", label: "Tổng quan" },
    { href: "/admin/categories", label: "Danh mục" },
    { href: "/admin/products", label: "Sản phẩm" },
    { href: "/admin/productVariant", label: "Biến thể sản phẩm" },
    { href: "/admin/color", label: "Màu sắc" },
    { href: "/admin/size", label: "Kích thước" },
    { href: "/admin/branch", label: "Chi nhánh" },
    { href: "/admin/users", label: "Người dùng" },
    { href: "/admin/promotion", label: "Khuyến mãi" },
    { href: "/admin/order", label: "Đơn hàng" },
    { href: "/admin/paymentHistory", label: "Lịch sử thanh toán" },
    { href: "/admin/chat", label: "Chat" },
  ];

  return (
    <>
      <aside>
        <h2 className="sider__logo">Adam Store</h2>
        <ul className="sider__list">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href; // 📌 So sánh chính xác

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`sider__link ${isActive ? "sider__active" : ""}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <header>
        <div className="header__input">
          <input type="text" placeholder="Tìm kiếm..." className="search-input" />
          <span className="header__search-icon">🔍</span>
        </div>
        <div className="header__profile">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <div>Tên người dùng</div>
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}