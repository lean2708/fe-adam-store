
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroBanner() {
    const t = useTranslations("Marketing");

    return (
        <div className="relative rounded-lg overflow-hidden mb-12">
            <div className="relative h-[400px] bg-gradient-to-r from-gray-100 to-gray-200">
                {/* <Image
                    src="/placeholder.svg?height=400&width=1200&text=5+Men+in+Casual+Clothing"
                    alt="New Products Hero"
                    fill
                    className="object-cover"
                /> */}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-2xl px-4">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("heroBanner.title")}</h2>
                        <p className="text-lg md:text-xl mb-6 opacity-90">
                            {t("heroBanner.description")}
                        </p>
                        <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-medium cursor-pointer">
                            {t("heroBanner.buyNow")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}