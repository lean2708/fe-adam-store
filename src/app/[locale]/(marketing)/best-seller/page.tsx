import { ContentBestSeller } from "@/components/templates/(marketing)/best-seller/BestSeller";
import { useTranslations } from "next-intl";

export default function BestSellerPage() {
    const t = useTranslations("Marketing");
  return (
    <div className="w-full !p-6">
      <h1 className="font-bold text-3xl text-center">{t("bestSellers.title")}</h1>
      <div className="h-full w-full">
        <ContentBestSeller />
      </div>
    </div>
  );
}
