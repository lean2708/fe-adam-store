"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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

  const products = [
    {
      id: 1,
      name: "Black Leather Jacket",
      price: "₫2,990,000",
      image: "/placeholder.svg?height=400&width=300&text=Black+Jacket",
    },
    {
      id: 2,
      name: "Casual Denim Look",
      price: "₫1,890,000",
      image: "/placeholder.svg?height=400&width=300&text=Denim+Look",
    },
    {
      id: 3,
      name: "Brown Coat Style",
      price: "₫3,490,000",
      image: "/placeholder.svg?height=400&width=300&text=Brown+Coat",
    },
    {
      id: 4,
      name: "White Shirt Casual",
      price: "₫890,000",
      image: "/placeholder.svg?height=400&width=300&text=White+Shirt",
    },
    {
      id: 5,
      name: "Graphic Tee Style",
      price: "₫590,000",
      image: "/placeholder.svg?height=400&width=300&text=Graphic+Tee",
    },
    {
      id: 6,
      name: "Beige Casual Wear",
      price: "₫1,290,000",
      image: "/placeholder.svg?height=400&width=300&text=Beige+Casual",
    },
    {
      id: 7,
      name: "Black Formal Suit",
      price: "₫5,990,000",
      image: "/placeholder.svg?height=400&width=300&text=Black+Suit",
    },
    {
      id: 8,
      name: "Casual Street Style",
      price: "₫1,590,000",
      image: "/placeholder.svg?height=400&width=300&text=Street+Style",
    },
    {
      id: 9,
      name: "Light Casual Shirt",
      price: "₫790,000",
      image: "/placeholder.svg?height=400&width=300&text=Light+Shirt",
    },
    {
      id: 10,
      name: "Dark Pants Style",
      price: "₫1,190,000",
      image: "/placeholder.svg?height=400&width=300&text=Dark+Pants",
    },
  ]

  const newProducts = [
    {
      id: 1,
      name: "ÁO IN COTTON CARE & SHARE",
      price: "690,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Black+Leather+Jacket",
      isNew: true,
      colors: ["black", "blue"],
    },
    {
      id: 2,
      name: "ÁO IN COTTON CARE & SHARE",
      price: "690,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Beige+Coat",
      isNew: true,
      colors: ["black", "blue"],
    },
    {
      id: 3,
      name: "ÁO THUN COTTON 220GSM REGULAR DISNEY STITCH SUMMER 1",
      price: "690,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Black+Pants",
      isNew: true,
      colors: ["black", "blue"],
    },
    {
      id: 4,
      name: "ÁO IN COTTON CARE & SHARE",
      price: "690,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Black+Jacket",
      isNew: true,
      colors: ["black", "blue"],
    },
    {
      id: 5,
      name: "PARKA POCKET",
      price: "690,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Parka+Jacket",
      isNew: true,
      colors: ["black", "blue"],
    },
    {
      id: 6,
      name: "ÁO HOODIE PREMIUM",
      price: "890,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Premium+Hoodie",
      isNew: true,
      colors: ["black", "blue"],
    },
    {
      id: 7,
      name: "QUẦN JEAN SLIM FIT",
      price: "790,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Slim+Jeans",
      isNew: true,
      colors: ["black", "blue"],
    },
    {
      id: 8,
      name: "ÁO SƠ MI OXFORD",
      price: "590,000 VND",
      image: "/placeholder.svg?height=400&width=300&text=Oxford+Shirt",
      isNew: true,
      colors: ["black", "blue"],
    },
  ]

  // Close search when clicking outside
  useEffect(() => {
    if (!isSearchExpanded) return
    function handleClick(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isSearchExpanded])

  return (
    <div className="min-h-screen adam-store-bg">
      {/* Header */}
      <header className="border-b adam-store-border adam-store-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Hidden when search is expanded */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold adam-store-text">
                Adam Store
              </Link>
            </div>

            {/* Navigation - Hidden when search is expanded */}
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
                <div className="relative flex items-center">
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className={cn(
                      "transition-all duration-300 ease-in-out adam-store-border focus:border-black",
                      "absolute top-0 right-0 transform ", // Always right-aligned
                      isSearchExpanded
                        ? // START of expanded classes using template literal
                        `
                        border-2 shadow-lg
                        w-[calc(100vw-200px)]
                        sm:w-[calc(100vw-200px)]
                        md:w-[calc(100vw-170px)]
                        lg:w-[calc(100vw-170px)]
                        xl:w-[calc(100vw-200px)]
                        2xl:w-[calc(100vw-400px)]
                        max-w-6xl
                        `
                        : // END of expanded classes
                        "w-64"
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
                    <Search className="h-4 w-4" />
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

              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>

                {/* Cart Dropdown */}
                {isCartOpen && (
                    <>
                    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40" onClick={() => setIsCartOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                      <div className="p-4">
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
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
              <nav className="space-y-0">
                <Link
                  href="/products/new"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SẢN PHẨM MỚI
                </Link>
                <Link
                  href="/products/bestsellers"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  BÁN CHẠY NHẤT
                </Link>
                <Link
                  href="/products/t-shirts"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ÁO THUN
                </Link>
                <Link
                  href="/products/shirts"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ÁO SƠ MI
                </Link>
                <Link
                  href="/products/polo"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ÁO POLO
                </Link>
                <Link
                  href="/products/jackets"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ÁO KHOÁC
                </Link>
                <Link
                  href="/products/jeans"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  QUẦN JEAN
                </Link>
                <Link
                  href="/products/shorts"
                  className="block py-4 px-2 text-gray-900 font-medium border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  QUẦN SHORT
                </Link>
              </nav>

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

      {/* Main Content */}
      <main className="py-8">
        {/* Hero Section */}
        <section className="mb-16">
          {/* Hero Carousel */}
          <div className="relative adam-store-bg-light rounded-lg overflow-hidden mb-8">
            <div className="flex items-center justify-center h-[500px] px-8">
              <div className="flex items-center justify-center space-x-8 max-w-6xl mx-auto">
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=400&width=280&text=Black+Jacket"
                    alt="Black Jacket Style"
                    width={280}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=400&width=280&text=Denim+Style"
                    alt="Denim Casual Style"
                    width={280}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=400&width=280&text=Brown+Coat"
                    alt="Brown Coat Style"
                    width={280}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=400&width=280&text=White+Shirt"
                    alt="White Shirt Style"
                    width={280}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=400&width=280&text=Beige+Hoodie"
                    alt="Beige Hoodie Style"
                    width={280}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>

            {/* Chat Button - Positioned between Carousel Dots and Featured Products */}
          </div>
          <div className="py-8 px-8">
            <div className="flex justify-end">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 shadow-lg">
                Chat với chúng tôi
              </Button>
            </div>
          </div>
          {/* Featured Products Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-8">
            {[
              { name: "Beige Shirt", price: "₫299,000" },
              { name: "Black Pants", price: "₫399,000" },
              { name: "Black Hoodie", price: "₫459,000" },
              { name: "Gray Shirt", price: "₫329,000" },
              { name: "Black Suit", price: "₫899,000" },
              { name: "Black Cap", price: "₫199,000" },
            ].map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-[3/4] adam-store-bg-light rounded-lg overflow-hidden mb-2">
                  <Image
                    src={`/placeholder.svg?height=300&width=200&text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    width={200}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs adam-store-text-gray text-center">{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bộ sưu tập mới */}
        <section className="mb-16 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold adam-store-text mb-2">Bộ sưu tập mới</h1>
            <p className="adam-store-text-gray">Khám phá những xu hướng thời trang mới nhất</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] adam-store-bg-light rounded-lg overflow-hidden mb-3">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium adam-store-text mb-1">{product.name}</h3>
                <p className="text-sm adam-store-text-gray">{product.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* New Products Hero Section */}
        <section className="mb-16">
          {/* Hero Banner */}
          <div className="relative rounded-lg overflow-hidden mb-12">
            <div className="relative h-[400px] bg-gradient-to-r from-gray-100 to-gray-200">
              <Image
                src="/placeholder.svg?height=400&width=1200&text=5+Men+in+Casual+Clothing"
                alt="New Products Hero"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Các sản phẩm mới</h2>
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    Khám phá bộ sưu tập mới nhất với những thiết kế độc đáo, chất lượng cao mang đến phong cách thời
                    trang hiện đại. Tìm hiểu những xu hướng mới nhất từ Adam Store để cập nhật phong cách thời trang của
                    bạn.
                  </p>
                  <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-medium">
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sản phẩm mới */}
          <div className="px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold adam-store-text">Sản phẩm mới</h2>
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800 px-6 py-2">
                Tất cả sản phẩm
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {newProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] adam-store-bg-light rounded-lg overflow-hidden mb-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">Mới</div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium adam-store-text mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full border-2 border-gray-300 ${color === "black" ? "bg-black" : color === "blue" ? "bg-blue-600" : `bg-${color}-500`
                          }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-sm adam-store-text font-semibold">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </div>
  )
}
