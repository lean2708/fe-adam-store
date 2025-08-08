import SectionHeader from "@/components/modules/SectionHeader";
import NewestProductsSwiper from "./NewestProducts/NewestProductsSwiper";

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
