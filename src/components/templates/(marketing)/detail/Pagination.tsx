"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductByCategoryAction } from "@/actions/categoryActions";
import { useEffect } from "react";

export default function Pagination() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy các tham số từ URL, nếu không có thì sẽ tự động set page=1, size=10 lên URL
  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");
  const page = Number(pageParam) || 1;
  const size = Number(sizeParam) || 10;
  // Sửa lại lấy category từ "category" thay vì "categoryId" cho đồng bộ
  const categoryId = searchParams.get("category") || "";
  const sort = ["desc"];

  // Tự động set page=1, size=10 lên URL nếu chưa có
  useEffect(() => {
    let shouldUpdate = false;
    const params = new URLSearchParams(searchParams.toString());
    if (!pageParam) {
      params.set("page", "1");
      shouldUpdate = true;
    }
    if (!sizeParam) {
      params.set("size", "10");
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      router.replace(`?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  const { data } = useQuery({
    queryKey: ["product", { page, size, sort, categoryId }],
    queryFn: () => getProductByCategoryAction({ categoryId, page, size, sort }),
    enabled: !!categoryId,
  });

  const totalItems = data?.result?.totalItems;
  const totalPages = data?.result?.totalPages;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`?${params.toString()}`);
  };

  // Nếu không có categoryId thì không hiển thị phân trang
  if (!categoryId || !totalItems || !totalPages) return null;

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={page === p ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(p)}
            className={page === p ? "bg-black text-white" : ""}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Footer Text */}
      <div className="text-center text-xs text-gray-500 mt-6">
        Trang {page} / {totalPages} - Đang hiển thị {totalItems} sản phẩm
      </div>
    </>
  );
}
