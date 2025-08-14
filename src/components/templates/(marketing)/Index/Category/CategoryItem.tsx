"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import { notoSans } from "@/config/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CategoryItem({
    id,
    imageSrc,
    title
}: {
    id: string;
    imageSrc: string;
    title: string
}) {
    const [isImageError, setImageError] = useState(false);
    return (
        <Link href={`./detail?category=${id}`}>
            <Card
                className={cn()}>
                <CardContent className={cn("p-0 pb-6")}>
                    <div
                        className={cn("aspect-[3/4] adam-store-bg-light rounded-lg overflow-hidden mb-2 relative flex items-center justify-center")}>
                        <AspectRatio ratio={3 / 4}>
                            <Image
                                className={cn("w-full h-full object-cover rounded-lg")}
                                src={ imageSrc}
                                alt={id}
                                width={300}
                                height={400}
                                onError={() => setImageError(true)}
                            />
                            {/* Center bottom button */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                                <button className="bg-white text-black text-base font-medium rounded-full px-6 py-2 shadow">
                                    {title}
                                </button>
                            </div>
                        </AspectRatio>
                    </div>
                
                </CardContent>
            </Card>
        </Link>
    );
}