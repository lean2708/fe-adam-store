import React, { ReactNode, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/useClickOutside"

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: "dropdown" | "centered" | "sidebar" | "custom"
  size?: "sm" | "md" | "lg" | "xl" | "full"
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center" | "left" | "right"
  showOverlay?: boolean
  closeOnClickOutside?: boolean
}

const variantStyles = {
  dropdown: "absolute bg-white rounded-lg shadow-xl border border-gray-200 z-50",
  centered: "fixed inset-0 z-50 flex items-center justify-center",
  sidebar: "fixed top-0 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
  custom: ""
}

const sizeStyles = {
  sm: "w-80",
  md: "w-96", 
  lg: "max-w-2xl w-full",
  xl: "max-w-6xl w-full",
  full: "w-full h-full"
}

const positionStyles = {
  "top-right": "top-15 right-8 mt-2",
  "top-left": "top-15 left-8 mt-2", 
  "bottom-right": "bottom-8 right-8",
  "bottom-left": "bottom-8 left-8",
  "center": "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  "left": "left-0",
  "right": "right-0"
}

export function Modal({
  open,
  onClose,
  children,
  className,
  style,
  variant = "dropdown",
  size = "md",
  position = "top-right",
  showOverlay = false,
  closeOnClickOutside = true,
  ...props
}: ModalProps) {
  // Use the hook to detect clicks outside the modal content
  const modalContentRef = useClickOutside(
    closeOnClickOutside ? onClose : () => {},
    open
  )

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  // For centered modals, we need a different structure
  if (variant === "centered") {
    return (
      <>
        {showOverlay && (
          <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 w-screen h-screen" />
        )}
        <div className={variantStyles.centered}>
          <div
            ref={modalContentRef}
            className={cn(
              "relative bg-white rounded-lg shadow-xl mx-4 my-8 z-50 flex flex-col overflow-hidden",
              sizeStyles[size],
              className
            )}
            style={{
              maxHeight: "80vh",
              ...style
            }}
            {...props}
          >
            {children}
          </div>
        </div>
      </>
    )
  }

  // For sidebar modals
  if (variant === "sidebar") {
    return (
      <>
        {showOverlay && (
          <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 w-screen h-screen" />
        )}
        <div
          ref={modalContentRef}
          className={cn(
            variantStyles.sidebar,
            sizeStyles[size],
            positionStyles[position],
            className
          )}
          style={{
            maxHeight: "100vh",
            ...style
          }}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }

  // For dropdown and custom modals
  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 w-screen h-screen" />
      )}
      <div
        ref={modalContentRef}
        className={cn(
          variant !== "custom" ? variantStyles[variant] : "",
          variant !== "custom" ? sizeStyles[size] : "",
          variant !== "custom" && position !== "center" ? positionStyles[position] : "",
          "flex flex-col",
          className
        )}
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

// Convenience components for common modal parts
export function ModalHeader({ 
  children, 
  className,
  ...props 
}: { 
  children: ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("p-4 border-b border-gray-200 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalBody({ 
  children, 
  className,
  scrollable = true,
  ...props 
}: { 
  children: ReactNode
  className?: string
  scrollable?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "p-4 flex-1 flex flex-col",
        scrollable ? "overflow-y-auto" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalFooter({ 
  children, 
  className,
  sticky = false,
  ...props 
}: { 
  children: ReactNode
  className?: string
  sticky?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "p-4 border-t border-gray-200 flex justify-center",
        sticky ? "sticky bottom-0 bg-white" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
