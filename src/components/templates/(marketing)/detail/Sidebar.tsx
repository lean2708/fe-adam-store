"use client";

import { TCategory } from "@/types";
import { UseQueryResult } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Sidebar({
  query,
}: {
  query: UseQueryResult<
    | {
        status: number;
        categories: TCategory[];
        message?: undefined;
        error?: undefined;
      }
    | {
        status: number;
        message: string;
        error: unknown;
        categories?: undefined;
      },
    unknown
  >;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch categories
  const { data, isLoading: categoriesLoading } = query;

  // Lấy danh sách id hợp lệ từ categories
  const validCategoryIds = useMemo(() => {
    if (!data?.categories) return [];
    return data.categories.map((c: TCategory) => String(c.id));
  }, [data]);

  // Lấy categoryId từ query
  const selectedCategoryId = searchParams.get("category");

  // Nếu categoryId trên query không hợp lệ, tự động set về category đầu tiên
  useEffect(() => {
    if (data && data.categories && data.categories.length > 0) {
      // Nếu không có category hoặc category không hợp lệ
      if (
        !selectedCategoryId ||
        !validCategoryIds.includes(selectedCategoryId)
      ) {
        const firstCategory = data.categories[0];
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("category", String(firstCategory.id));
        router.replace(`?${params.toString()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchParams, router, selectedCategoryId, validCategoryIds]);

  const onCategorySelect = (cate: TCategory) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("category", String(cate.id));
    router.push(`?${params.toString()}`);
  };

  // Nếu chưa có data hoặc categoryId không hợp lệ, không render sidebar (đợi useEffect đồng bộ)
  if (
    !data ||
    !data.categories ||
    data.categories.length === 0 ||
    !selectedCategoryId ||
    !validCategoryIds.includes(selectedCategoryId)
  ) {
    // Có thể show loading hoặc null
    return categoriesLoading ? <h1>loading</h1> : null;
  }

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
              data.categories.map((category: TCategory) => (
                <label
                  key={category.id}
                  className={`flex items-center gap-2 py-1 cursor-pointer rounded transition-colors ${
                    selectedCategoryId === String(category.id)
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryId === String(category.id)}
                    onChange={() => onCategorySelect(category)}
                    className="form-checkbox h-5 w-5 accent-black rounded border-gray-300"
                  />
                  <span
                    className={`text-sm ${
                      selectedCategoryId === String(category.id)
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
