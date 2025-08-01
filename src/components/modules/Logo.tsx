
import Link from "next/link"

interface LogoProps {
  className?: string
  href?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl"
}

export default function Logo({
  className = "",
  href = "/",
  size = "md"
}: LogoProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <Link
        href={href}
        className={`${sizeClasses[size]} font-bold adam-store-text ${className}`}
      >
        Adam Store
      </Link>
    </div>
  )
}
