"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import SearchInput from "@/components/ui/search-input"
import SearchModal from "../modal/SearchModal"

interface SearchComponentProps {
  onSearchExpand?: (expanded: boolean) => void
}

export default function SearchComponent({ onSearchExpand }: SearchComponentProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
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

  // Handle search expansion
  const handleSearchExpand = useCallback((expanded: boolean) => {
    setIsSearchExpanded(expanded)
    onSearchExpand?.(expanded)
  }, [onSearchExpand])

  // Click outside handler
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
    handleSearchExpand(false)
    setSearchValue("")
    setSearchModalOpen(false)
  }, [isSearchExpanded, handleSearchExpand])

  // Handle clicks outside search area
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  // Modal close handler
  const handleSearchModalClose = useCallback(() => {
    setSearchModalOpen(false)
    handleSearchExpand(false)
  }, [handleSearchExpand])

  return (
    <>
      {/* Expanded Search Overlay */}
      {isSearchExpanded && (
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
                  onBlur={() => { !searchModalOpen ? handleSearchExpand(false) : null }}
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay Backdrop */}
      {isSearchExpanded && (
        <div className="fixed inset-0 bg-opacity-20 z-40" onClick={() => handleSearchExpand(false)} />
      )}

      {/* Desktop Search - Pill Style (hidden on mobile) */}
      <div className="hidden sm:flex absolute right-40 top-0 h-16 items-center z-20" ref={searchRef}>
        <SearchInput
          variant="pill"
          value={searchValue}
          onChange={handleSearchChange}
          onClick={() => handleSearchExpand(true)}
          onFocus={() => handleSearchExpand(true)}
          className="w-[250px]
                    md:w-[150px]
                    lg:w-[200px]
                    xl:w-[250px]
                    2xl:w-[280px]"
        />
      </div>

      {/* Mobile Search Button */}
      <Button
        variant="ghost"
        size="sm"
        className="sm:hidden  absolute right-40 top-0 h-16 items-center z-20"
        onClick={() => setSearchModalOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Search Modal */}
      {searchModalOpen && (
        <SearchModal
          open={searchModalOpen}
          onClose={handleSearchModalClose}
          searchQuery={debouncedSearchValue}
          isSearchExpanded={isSearchExpanded}
        />
      )}
    </>
  )
}
