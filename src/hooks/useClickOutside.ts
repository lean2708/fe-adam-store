import { useRef, useEffect, RefObject, useCallback } from "react"

/**
 * Custom hook to handle click outside functionality for modals and dropdowns
 * @param onClose - Callback function to execute when clicking outside
 * @param isOpen - Boolean to control when the hook is active
 * @returns ref - Ref object to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  onClose: () => void,
  isOpen: boolean = true
): RefObject<T | null> {
  const ref = useRef<T | null>(null)

  // Memoize the callback to prevent unnecessary re-renders
  const memoizedOnClose = useCallback(onClose, [onClose])

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      // Check if event.target is a Node and if the ref contains it
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        memoizedOnClose()
      }
    }

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, memoizedOnClose])

  return ref
}
