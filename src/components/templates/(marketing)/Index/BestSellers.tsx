import SectionHeader from "@/components/modules/SectionHeader";
import BestSellersSwiper from "./BestSellers/BestSellersSwiper";
import { Button } from "@/components/ui/button";

export default function BestSellers() {
  return (
    <section className="mb-16 px-4">
      <SectionHeader
        to="/best-seller"
        title="Bán chạy nhất"
        // description="Get best product"
        className="mt-10"
        hasButton={true}
      />
      <BestSellersSwiper />
    </section>
  );
}
