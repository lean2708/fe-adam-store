import SectionHeader from "@/components/modules/SectionHeader";
import BestSellersSwiper from "./BestSellers/BestSellersSwiper";
<<<<<<< HEAD
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
=======
import { useTranslations } from "next-intl";

export default function BestSellers() {
    const t = useTranslations("Marketing");

    return (
        <section className="mb-16 px-4">
            <SectionHeader
                title={t("bestSellers.title")}
                // description="Get best product"
                className="mt-10"
                hasButton={true}
            />

            <BestSellersSwiper />
        </section>
    );
}
>>>>>>> b123cf7f83c805fe68a5ef76852a3a674b76c392
