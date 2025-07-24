"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Import modals from modal folder
import UserModal from "./modal/UserModal"
import CartModal from "./modal/CartModal"
import MobileSidebar from "./modal/MobileSidebar"
import SearchModal from "./modal/SearchModal"

export default function Navbar() {
  // Only manage open/close triggers here
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
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

  const isAnyModalOpen = isSearchExpanded || isCartOpen || isUserModalOpen || isMobileMenuOpen

  return (
    <header className="border-b adam-store-border adam-store-bg relative h-16 flex items-center">
      {/* Overlay for any modal */}
      {(isAnyModalOpen || searchModalOpen) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300" />
      )}
      {/* Search expanded: center input in header, hide other header content */}
      {isSearchExpanded ? (
        <div
          className={cn(
            "w-full flex items-center justify-center h-16 absolute inset-0 bg-white z-50",
            "transition-all duration-300 ease-in-out",
            isSearchExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          )}
          style={{ backgroundColor: "white" }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <form
                onSubmit={e => {
                  e.preventDefault()
                  setSearchModalOpen(true)
                }}
              >
                <div className="flex items-center bg-white rounded-full px-4 py-0.5 shadow-md border border-gray-300">
                  <Input
                    autoFocus
                    type="search"
                    placeholder="Tìm kiếm..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none placeholder-gray-400 h-8"
                    onBlur={() => setIsSearchExpanded(false)}
                  />
                  <Search className="h-4 w-4 text-gray-400 ml-2" />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute left-5 top-0 h-16 flex items-center z-50 pl-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center justify-center w-full">
                <Link href="/" className="text-2xl font-bold adam-store-text">
                  Adam Store
                </Link>
              </div>
              {/* Navigation */}
              {/* <nav className="hidden md:flex items-center space-x-8">
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
              </nav> */}
            </div>
          </div>
          <div className="absolute right-5 top-0 h-16 flex items-center  pl-2">
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
                    onClick={() => setSearchModalOpen(true)}
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
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={() => setSearchModalOpen(true)}
              >
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
              </div>
              {/* User Modal */}
              <div className="relative">
                {isUserModalOpen && (
                  <UserModal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
                )}
              </div>
              <div className="relative">
                {/* Cart Modal */}
                {isCartOpen && (
                  <CartModal
                    open={isCartOpen}
                    cartItems={cartItems}
                    onClose={() => setIsCartOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Mobile Sidebar */}
          {isMobileMenuOpen && (
            <MobileSidebar open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
          )}
        </>
      )}
      {/* Show SearchModal when searchModalOpen is true */}
      {searchModalOpen && (
        <SearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      )}
    </header>
  )
}
