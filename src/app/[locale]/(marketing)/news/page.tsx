import { ContentNews } from "@/components/templates/(marketing)/news/ContentNew";
import { useTranslations } from "next-intl";

export default function NewsPage() {
  const t = useTranslations("Marketing");
  return (
    <div className="w-full !p-6">
      <h1 className="font-bold text-3xl text-center">
        {t("newestProducts.title")}
      </h1>
      <div className="h-full w-full">
        <ContentNews />
      </div>
    </div>
  );
}
