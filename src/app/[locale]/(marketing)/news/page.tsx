import { ContentNews } from "@/components/templates/(marketing)/news/ContentNew";

export default function NewsPage() {
  return (
    <div className="w-full !p-6">
      <h1 className="font-bold text-3xl text-center">Sản phẩm mới</h1>
      <div className="h-full w-full">
        <ContentNews />
      </div>
    </div>
  );
}
