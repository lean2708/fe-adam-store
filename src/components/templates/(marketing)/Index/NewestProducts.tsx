import SectionHeader from "@/components/modules/SectionHeader";
import NewestProductsSwiper from "./NewestProducts/NewestProductsSwiper";
import { useTranslations } from "next-intl";

export default function NewestProducts() {
    const t = useTranslations("Marketing");

    return (
        <section className="mb-16 px-4">
            <SectionHeader
                title={t("newestProducts.title")}
                // description="Get newest product"
                className="mt-10"
                hasButton={true}
            />

            <NewestProductsSwiper />
        </section>
    );
}