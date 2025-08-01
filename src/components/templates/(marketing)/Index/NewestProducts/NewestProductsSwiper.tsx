"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { TProduct } from "@/types";
import ProductCardIndex from "@/components/modules/ProductCardIndex";
import { getAllProductsAction } from "@/actions/productActions";
import { ProductCardWithColorsSkeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function NewestProductsSwiper() {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Fetch newest products (first 10 items, sorted by creation date)
                const response = await getAllProductsAction(0, 10, ["createdAt,desc"]);

                if (response.status === 200 && response.products) {
                    setProducts(response.products);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="w-full">
                <Carousel className="w-full">
                    <CarouselContent>
                        {[...Array(5)].map((_, index) => (
                            <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                                <ProductCardWithColorsSkeleton />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        );
    }

    // Show empty state if no products
    if (!products.length) {
        return (
            <div className="w-full text-center py-8">
                <p className="text-gray-500">Không có sản phẩm mới nào.</p>
            </div>
        );
    }

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {products.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                        <ProductCardIndex
                            product={product}
                            badgeText="Mới nhất"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}