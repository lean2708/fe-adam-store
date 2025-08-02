import { Button } from "@/components/ui/button";
import MainBannerSwiper from "./MainBanner/MainBannerSwiper";
import { useTranslations } from "next-intl";

// List of banner image filenames in public/imgs/banner
const bannerImages = [
    "banner1.jpg",
    "banner2.jpg",
    "banner3.jpg",
    // Add more filenames as needed
];

const heroSlides = bannerImages.map((filename, idx) => ({
    src: `/imgs/banner/${filename}`,
    alt: `Banner ${idx + 1}`,
}));

export default function MainBanner() {
    const t = useTranslations("Languages");
    return (
        <section className="mb-16">
            {/* Hero Carousel - Embla carousel */}
            <div className="relative adam-store-bg-light overflow-hidden w-full" style={{ minHeight: 400 }}>
                <MainBannerSwiper heroSlides={heroSlides} />
                {/* Custom Pagination */}
            </div>
            <div className="py-8 px-8">
                <div className="flex justify-end">
                    <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 shadow-lg">
                        {t("chatwithus")}
                    </Button>
                </div>
            </div>


        </section>
    );
}