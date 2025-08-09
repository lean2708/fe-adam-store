"use client";

import { TCategory } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  // Lấy mảng categories từ cache
  const categories = queryClient.getQueryData<{ categories: TCategory[] }>([
    "categories",
  ])?.categories;
  const searchCateId = searchParams.get("category");

  // Lấy ra category duy nhất theo id (nếu có)
  const currentCat = categories?.filter(
    (cate) => String(cate.id) === String(searchCateId)
  )[0];

  // Lấy sort từ searchParams, mặc định là "desc"
  const sortParam = searchParams.get("sort") || "desc";

  // Hàm thay đổi sort và cập nhật searchParams
  const onSortChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sort", value);
    // Reset page về 1 khi sort thay đổi (nếu có page)
    if (params.has("page")) {
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (!searchParams.get("sort")) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("sort", "desc");
      // Reset page về 1 nếu có page
      if (params.has("page")) {
        params.set("page", "1");
      }
      router.replace(`?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  return (
    <header className="px-4 py-3">
      <div className="flex items-center justify-between mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentCat?.title || "Sản phẩm"}
        </h1>
        <div className="flex items-center gap-6">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sắp xếp:</span>
            <select
              className="w-48 border rounded px-2 py-1"
              value={sortParam}
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
