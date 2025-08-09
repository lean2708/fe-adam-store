import SectionHeader from "@/components/modules/SectionHeader";
import NewestProductsSwiper from "./NewestProducts/NewestProductsSwiper";
import { useTranslations } from "next-intl";

export default function NewestProducts() {
  return (
    <section className="mb-16 px-4">
      <SectionHeader
        to="/news"
        title="Sản phẩm mới nhất"
        // description="Get newest product"
        className="mt-10"
        hasButton={true}
      />

      <NewestProductsSwiper />
    </section>
  );
}
