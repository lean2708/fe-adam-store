"use client";


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { TProduct } from "@/types";
import Image from "next/image";

export default function BestSellersSwiper({
    products,
}: {
    products: TProduct[];
}) {
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {products.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                        <div className="group cursor-pointer relative">
                            {/* Đáng Mua Button */}
                            <button
                                className="absolute top-3 right-3 z-10 bg-white text-black text-xs font-semibold px-4 py-1 rounded-full shadow hover:bg-gray-100 transition"
                                style={{ pointerEvents: "auto" }}
                            >
                                Đáng Mua
                            </button>
                            <div className="aspect-[3/4] adam-store-bg-light rounded-lg overflow-hidden mb-3 relative">
                                <Image
                                    src={product.mainImage || "https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300"}
                                    alt={product.name || "Product image"}
                                    width={300}
                                    height={400}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                                    <div className="w-full px-3 pb-3">
                                        <button className="w-full bg-black text-white rounded-full py-2 font-semibold text-sm mb-2 hover:bg-gray-900 transition">
                                            Thêm vào giỏ hàng +
                                        </button>
                                        <div className="flex justify-center gap-2">
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-xs font-medium">M</span>
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-xs font-medium">L</span>
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-xs font-medium">XL</span>
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-400 line-through">2XL</span>
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-400 line-through">3XL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-md font-medium adam-store-text mb-1">{"Ten cua mon hang"}</h3>
                            {/* Color dots */}
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <span className="inline-block w-7 h-7 rounded-full bg-[#ededed] border border-gray-200" />
                                <span className="inline-block w-7 h-7 rounded-full bg-[#232323] border border-gray-200" />
                                <span className="inline-block w-7 h-7 rounded-full bg-[#1746b0] border border-gray-200" />
                            </div>
                            <p className="text-base font-bold adam-store-text mb-1">{"?"}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}