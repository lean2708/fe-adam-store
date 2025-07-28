import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onClick?: () => void
  onBlur?: () => void
  placeholder?: string
  className?: string
  variant?: "default" | "pill" | "expanded"
  autoFocus?: boolean
}

const variantStyles = {
  default: "border-2 adam-store-border",
  pill: "bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105",
  expanded: "bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 shadow-lg border-2 border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out scale-100 hover:scale-105 relative z-[9999]"
}

export default function SearchInput({
  value,
  onChange,
  onFocus,
  onClick,
  onBlur,
  placeholder = "Tìm kiếm",
  className = "",
  variant = "default",
  autoFocus = false
}: SearchInputProps) {
  const isPillOrExpanded = variant === "pill" || variant === "expanded"

  if (isPillOrExpanded) {
    return (
      <div
        className={cn(
          "flex items-center transition-all duration-500 ease-out ",
          variantStyles[variant],
          className
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
        <Input
          autoFocus={autoFocus}
          type="search"
          placeholder={variant === "pill" && value === "" ? placeholder : ""}
          value={variant === "pill" ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 h-auto p-0 transition-all duration-300 cursor-text pointer-events-auto relative z-[9999]"
          onBlur={onBlur}
          onFocus={onFocus}
          onClick={onClick}
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    )
  }

  return (
    <div className="relative flex items-center">
      <Input
        autoFocus={autoFocus}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "transition-all duration-300 ease-in-out",
          variantStyles[variant],
          className
        )}
        onFocus={onFocus}
        onClick={onClick}
        onBlur={onBlur}
      />
      <Search className="h-4 w-4 text-gray-400 absolute right-3" />
    </div>
  )
}
