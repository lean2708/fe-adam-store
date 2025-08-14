"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductByCategoryAction } from "@/actions/categoryActions";
import { useEffect } from "react";

export default function Pagination(props:{totalPage: number, page: number, totalProduct: number, onChangePage: (newPage: number)=>void}) {
const {totalPage, page, totalProduct, onChangePage}= props

  return (
    <div className="py-8">
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPage || 1 }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={page+ 1 === p ? "default" : "outline"}
            size="sm"
            onClick={() => onChangePage(p)}
            className={page+ 1 === p ? "bg-black text-white" : ""}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Footer Text */}
      <div className="text-center text-xs text-gray-500 mt-3">
        Trang {page+ 1} / {totalPage} - Đang hiển thị {totalProduct} sản phẩm
      </div>
    </div>
  );
}
