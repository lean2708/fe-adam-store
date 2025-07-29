import SectionHeader from "@/components/modules/SectionHeader";
import { TProduct } from "@/types";
import BestSellersSwiper from "./BestSellers/BestSellersSwiper";

export default function BestSellers({ products }: { products: TProduct[] }) {
    return (
        <section className="mb-16 px-4">
            <SectionHeader
                title="Sản phẩm mới nhất"
                description="Get newest product"
                className="mt-10"
                hasButton={true}
            />

            <BestSellersSwiper products={products} />
        </section>
    );
}