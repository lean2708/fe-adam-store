import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

type SearchModalProps = {
    open: boolean
    onClose: () => void
}

const dummyResults = Array.from({ length: 6 }).map((_, idx) => ({
    id: idx + 1,
    name: "ÁO IN COTTON CARE & SHARE",
    price: 690000,
    image: "/placeholder.svg?height=180&width=140",
}))

export default function SearchModal({ open, onClose }: SearchModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 my-8 z-50 flex flex-col overflow-hidden"
            >
                {/* Scrollable content */}
                <div
                    className="p-6 overflow-y-auto"
                    style={{ maxHeight: "70vh" }}
                >
                    <div className="mb-4 font-semibold text-lg">Kết quả tìm kiếm</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {dummyResults.map((item) => {
                            const [imageError, setImageError] = useState(false)
                            const imageSrc = imageError ? "/fallback.png" : item.image
                            const title = item.name
                            return (
                                <Card key={item.id}>
                                    <CardContent className="p-0 pb-6">
                                        <div className="aspect-[3/4] adam-store-bg-light rounded-lg overflow-hidden relative flex items-center justify-center">
                                            <AspectRatio ratio={3 / 4}>
                                                <Image
                                                    className="w-full h-full object-cover rounded-[4px]"
                                                    src={imageSrc}
                                                    alt={title}
                                                    width={300}
                                                    height={400}
                                                    onError={() => setImageError(true)}
                                                />
                                            </AspectRatio>
                                        </div>
                                    </CardContent>
                                    <div className="text-center text-sm">{item.name}</div>
                                    <div className="mt-2 text-center text-sm font-bold">
                                        {item.price.toLocaleString("vi-VN")} VND
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Sticky footer */}
                <div className="p-4 border-t bg-white flex justify-center sticky bottom-0">
                    <Button
                        className="bg-black text-white px-6 py-2 rounded-md"
                        onClick={() => {
                            alert("Xem thêm sản phẩm!")
                            onClose()
                        }}
                    >
                        Xem thêm sản phẩm
                    </Button>
                </div>
            </div>
        </div>
    )
}
