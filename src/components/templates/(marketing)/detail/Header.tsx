import { TCategory } from "@/types";

interface HeaderProps {
  currentCategory: TCategory;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function Header({
  currentCategory,
  sortBy,
  onSortChange,
}: HeaderProps) {
  return (
    <header className=" px-4 py-3">
      <div className="flex items-center justify-between  mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentCategory?.title || "Sản phẩm"}
        </h1>
        <div className="flex items-center gap-6">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sắp xếp:</span>
            <select
              className="w-48 border rounded px-2 py-1"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
