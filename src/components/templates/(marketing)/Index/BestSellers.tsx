import SectionHeader from "@/components/modules/SectionHeader";
import BestSellersSwiper from "./BestSellers/BestSellersSwiper";
import { useTranslations } from "next-intl";

export default function BestSellers() {
  const t = useTranslations("Marketing");

  return (
    <section className="mb-16 px-4">
      <SectionHeader
        to="/news"
        title={t("bestSellers.title")}
        // description="Get best product"
        className="mt-10"
        hasButton={true}
      />

      <BestSellersSwiper />
    </section>
  );
}
