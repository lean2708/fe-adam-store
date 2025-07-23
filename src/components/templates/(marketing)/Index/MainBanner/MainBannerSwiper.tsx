"use client";


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPagination,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type HeroSlide = {
    src: string;
    alt: string;
    // add other properties if needed
};

export default function MainBannerSwiper({
    heroSlides,
}: {
    heroSlides: HeroSlide[];
}) {
    return (
        <Carousel className="w-full" >
            <CarouselContent>
                {heroSlides.map((slide, idx) => (
                    <CarouselItem key={idx}>
                        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                className="object-cover"
                                priority={idx === 0}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselPagination />
        </Carousel>
    );
}