"use client";

import { Button } from "@/components/ui/button";

export default function Pagination(props: {
  type?: string;
  totalPage: number;
  page: number;
  totalProduct: number;
  onChangePage: (newPage: number) => void;
}) {
  const { totalPage, type, page, totalProduct, onChangePage } = props;
  const newTotalPage =
    type === "news" || type === "best-seller"
      ? Math.min(totalPage, 5)
      : totalPage;
  const newTotalProducts =
    type === "news" || type === "best-seller"
      ? Math.min(totalProduct, 5*12)
      : totalProduct;
  return (
    <div className="py-8">
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: newTotalPage || 1 }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={page + 1 === p ? "default" : "outline"}
            size="sm"
            onClick={() => onChangePage(p)}
            className={page + 1 === p ? "bg-black text-white" : ""}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Footer Text */}
      <div className="text-center text-xs text-gray-500 mt-3">
        Trang {page + 1} / {newTotalPage} - Đang hiển thị {newTotalProducts} sản
        phẩm
      </div>
    </div>
  );
}
