
"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Search, ShoppingBag, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Import modals from modal folder
import UserModal from "./modal/UserModal"
import CartModal from "./modal/CartModal"
import MobileSidebar from "./modal/MobileSidebar"
import SearchModal from "./modal/SearchModal"
import ThemeToggle from "@/components/modules/ThemeToggle"
import Logo from "@/components/modules/Logo"
import SearchInput from "@/components/ui/search-input"

export default function Navbar() {
  // Only manage open/close triggers here
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const expandedSearchRef = useRef<HTMLDivElement>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchValue(value)
    }, 300)
  }, [])

  // Memoized cart data and calculations
  const cartItems = useMemo(() => [
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
  ], [])

  const cartItemCount = useMemo(() =>
    cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )



  // Memoized click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!isSearchExpanded) return

    const target = event.target as Element

    // Check if click is inside search input area
    if (searchRef.current?.contains(target)) {
      return
    }

    // Check if click is inside expanded search container
    if (expandedSearchRef.current?.contains(target)) {
      return
    }

    // Check if click is inside search modal
    const searchModal = document.querySelector('[data-search-modal]')
    if (searchModal?.contains(target)) {
      return
    }

    // Close expanded search and modal when clicking outside
    setIsSearchExpanded(false)
    setSearchValue("")
    setSearchModalOpen(false)
  }, [isSearchExpanded])

  // Handle clicks outside search area
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  // Memoized modal close handlers
  const handleSearchModalClose = useCallback(() => {
    setSearchModalOpen(false)
    setIsSearchExpanded(false)
  }, [])

  const handleCartModalClose = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const handleUserModalClose = useCallback(() => {
    setIsUserModalOpen(false)
  }, [])

  const handleMobileSidebarClose = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <header className="border-b adam-store-border adam-store-bg relative h-16 flex items-center">
      <ThemeToggle />
      {/* Search expanded: center input in header, hide other header content */}
      {isSearchExpanded ? (
        <div
          ref={expandedSearchRef}
          data-search-expanded
          className={cn(
            "w-full flex items-center justify-center h-16 absolute inset-0 z-[9999]",
            "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform will-change-transform",
            isSearchExpanded
              ? "opacity-100 scale-100 translate-y-0 bg-white dark:bg-gray-900"
              : "opacity-0 scale-95 translate-y-[-10px] pointer-events-none bg-white/0 dark:bg-gray-900/0"
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
                <SearchInput
                  variant="expanded"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onBlur={() => { !searchModalOpen ? setIsSearchExpanded(false) : null }}
                  autoFocus
                />
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
              <Logo />
            </div>
          </div>
          <div className="absolute right-5 top-0 h-16 flex items-center  pl-2">
            {/* Search and Icons */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search - Pill Style */}
              <div className="hidden sm:flex items-center relative" ref={searchRef}>
                <SearchInput
                  variant="pill"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onClick={() => setIsSearchExpanded(true)}
                  onFocus={() => setIsSearchExpanded(true)}
                  className="w-auto min-w-0
                            sm:w-[100px]
                            md:w-[150px]
                            lg:w-[200px]
                            xl:w-[250px]
                            2xl:w-[280px]"
                />
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
                  <UserModal open={isUserModalOpen} onClose={handleUserModalClose} />
                )}
              </div>
              <div className="relative">
                {/* Cart Modal */}
                {isCartOpen && (
                  <CartModal
                    open={isCartOpen}
                    cartItems={cartItems}
                    onClose={handleCartModalClose}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Mobile Sidebar */}
          {isMobileMenuOpen && (
            <MobileSidebar open={isMobileMenuOpen} onClose={handleMobileSidebarClose} />
          )}
        </>
      )}
      {/* Show SearchModal when searchModalOpen is true */}
      {searchModalOpen && (
        <SearchModal
          open={searchModalOpen}
          onClose={handleSearchModalClose}
          searchQuery={debouncedSearchValue}
          isSearchExpanded={isSearchExpanded}
        />
      )}
    </header>
  )
}
