import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { TCategory } from "@/types";

interface SidebarProps {
  categories: TCategory[];
  categoriesLoading: boolean;
  selectedCategory: TCategory | null;
  onCategorySelect: (category: TCategory) => void;
}

export default function Sidebar({
  categories,
  categoriesLoading,
  selectedCategory,
  onCategorySelect,
}: SidebarProps) {
  // Tách nhóm sản phẩm, loại bỏ "GIÁ" và "THỜI TRANG NAM"
  const productCategories = useMemo(() => {
    return categories.filter(
      (cat) => cat.title !== "GIÁ" && cat.title !== "THỜI TRANG NAM"
    );
  }, [categories]);

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <nav>
        {/* Nhóm sản phẩm */}
        <div>
          <div className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-700 tracking-wide uppercase flex items-center justify-between">
            <span>NHÓM SẢN PHẨM</span>
            <span className="text-gray-400 text-base">{">"}</span>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {categoriesLoading ? (
              <div className="text-gray-500 text-sm">Đang tải danh mục...</div>
            ) : (
              productCategories.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center gap-2 py-1 cursor-pointer rounded transition-colors ${
                    selectedCategory?.id === category.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory?.id === category.id}
                    onChange={() => onCategorySelect(category)}
                    className="form-checkbox h-5 w-5 accent-black rounded border-gray-300"
                  />
                  <span
                    className={`text-sm ${
                      selectedCategory?.id === category.id
                        ? "font-semibold text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {category.title}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
