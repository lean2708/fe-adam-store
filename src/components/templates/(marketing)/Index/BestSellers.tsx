import SectionHeader from "@/components/modules/SectionHeader";
import BestSellersSwiper from "./BestSellers/BestSellersSwiper";

export default function BestSellers() {
    return (
        <section className="mb-16 px-4">
            <SectionHeader
                title="Best Sellers"
                description="Get best product"
                className="mt-10"
                hasButton={true}
            />

            <BestSellersSwiper />
        </section>
    );
}