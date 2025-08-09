import SectionHeader from "@/components/modules/SectionHeader";
import NewestProductsSwiper from "./NewestProducts/NewestProductsSwiper";
import { useTranslations } from "next-intl";

export default function NewestProducts() {
<<<<<<< HEAD
  return (
    <section className="mb-16 px-4">
      <SectionHeader
        to="/news"
        title="Sản phẩm mới nhất"
        // description="Get newest product"
        className="mt-10"
        hasButton={true}
      />
=======
    const t = useTranslations("Marketing");

    return (
        <section className="mb-16 px-4">
            <SectionHeader
                title={t("newestProducts.title")}
                // description="Get newest product"
                className="mt-10"
                hasButton={true}
            />
>>>>>>> b123cf7f83c805fe68a5ef76852a3a674b76c392

      <NewestProductsSwiper />
    </section>
  );
}
