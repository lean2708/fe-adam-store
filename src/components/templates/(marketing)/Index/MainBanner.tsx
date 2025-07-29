import { Button } from "@/components/ui/button";
import MainBannerSwiper from "./MainBanner/MainBannerSwiper";

export default function MainBanner() {
    const heroSlides = [
        {
            src: 'https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            alt: 'Streetwear fashion 1',
        },
        {
            src: 'https://images.pexels.com/photos/1039864/pexels-photo-1039864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            alt: 'Urban fashion style 2',
        },
        {
            src: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            alt: 'Modern menswear 3',
        },
    ]
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
                        Chat với chúng tôi
                    </Button>
                </div>
            </div>


        </section>
    );
}