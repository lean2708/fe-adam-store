"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Navbar() {
  // Move all state management inside Navbar
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Example cart data (replace with context or props if needed)
  const cartItems = [
    {
      id: 1,
      name: "Áo in cotton Care & Share",
      color: "trắng kem",
      size: "3XL",
      price: 700000,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Áo in cotton Care & Share",
      color: "trắng kem",
      size: "3XL",
      price: 700000,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="border-b adam-store-border adam-store-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold adam-store-text">
              Adam Store
            </Link>
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="adam-store-text hover:text-gray-500 transition-colors">
              Trang chủ
            </Link>
            <Link href="/products" className="adam-store-text hover:text-gray-500 transition-colors">
              Sản phẩm
            </Link>
            <Link href="/about" className="adam-store-text hover:text-gray-500 transition-colors">
              Giới thiệu
            </Link>
            <Link href="/contact" className="adam-store-text hover:text-gray-500 transition-colors">
              Liên hệ
            </Link>
          </nav>
          {/* Search and Icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search - Expandable */}
            <div className="hidden sm:flex items-center relative" ref={searchRef}>
              <div className="relative flex items-center ">
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className={cn(
                    "h-9",
                    "transition-all duration-300 ease-in-out adam-store-border ",
                    "absolute top-0 right-0 transform ",
                    isSearchExpanded
                      ? `
                        border-2 shadow-lg px-4 py-2
                        w-[calc(100vw-200px)]
                        sm:w-[calc(100vw-200px)]
                        md:w-[calc(100vw-170px)]
                        lg:w-[calc(100vw-170px)]
                        xl:w-[calc(100vw-200px)]
                        2xl:w-[calc(100vw-400px)]
                        max-w-6xl
                        `
                      : `
                        w-0 overflow-hidden placeholder-transparent
                        sm:w-10 sm:overflow-hidden sm:placeholder-transparent
                        md:w-10 md:overflow-hidden md:placeholder-transparent
                        lg:w-50 lg:overflow-hidden lg:placeholder-black
                        xl:w-72 xl:placeholder-black
                        2xl:w-72 2xl:placeholder-black
                      `
                  )}
                  onClick={() => setIsSearchExpanded(true)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 relative "
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                >
                  <Search className="h- w-4" />
                </Button>
              </div>
            </div>
            {/* Search Overlay Backdrop */}
            {isSearchExpanded && (
              <div className="fixed inset-0 bg-opacity-20 z-40" onClick={() => setIsSearchExpanded(false)} />
            )}
            {/* Mobile Search Button */}
            <Button variant="ghost" size="sm" className="sm:hidden">
              <Search className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setIsUserModalOpen((v) => !v)}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            {/* User Modal - vertical flow, fixed layout */}
            <div className="relative">
              {isUserModalOpen && (
                <UserModal onClose={() => setIsUserModalOpen(false)} />
              )}
            </div>
            <div className="relative">

              {/* Cart Dropdown */}
              {isCartOpen && (
                <>
                  <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40" onClick={() => setIsCartOpen(false)} />
                  <div className="fixed top-15 right-8 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200 flex flex-col">
                    <div className="p-4 flex-1 flex flex-col">
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
                          onClick={() => setIsCartOpen(false)}
                        >
                          Mua ngay
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 py-3 rounded-md font-medium bg-transparent"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Giỏ hàng của bạn
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden">
            <div className="p-4">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X className="h-6 w-6 text-gray-600" />
                </button>
                <h2 className="text-lg font-medium text-gray-900">Danh mục</h2>
                <div className="w-10"></div>
              </div>
              {/* Main Categories */}
              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <nav className="space-y-4">
                  <Link
                    href="/about"
                    className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Về chúng tôi
                  </Link>
                  <Link
                    href="/policies"
                    className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Chính sách
                  </Link>
                  <Link
                    href="/fashion-tips"
                    className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kiến thức mặc đẹp
                  </Link>
                  <Link
                    href="/customer-care"
                    className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Chăm sóc khách hàng
                  </Link>
                  <Link
                    href="/stores"
                    className="block py-2 px-2 text-gray-500 text-sm hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cửa hàng
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

// Add this at the bottom of the file (or above export default)
function UserModal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

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
