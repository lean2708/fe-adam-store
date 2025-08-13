"use client";

import Sidebar from "@/components/templates/(marketing)/detail/Sidebar";
import Pagination from "@/components/templates/(marketing)/detail/Pagination";
import Products from "@/components/templates/(marketing)/detail/Products";
import Header from "@/components/templates/(marketing)/detail/Header";
import { useQuery } from "@tanstack/react-query";
import {
  getAllCategoriesAction,
  getProductByCategoryAction,
} from "@/actions/categoryActions";
import { useSearchParamsConfig } from "@/hooks/useSearchParams";

export default function AoPoloStore() {
  const { page, size, sort, categoryId } = useSearchParamsConfig();

  const gêtAllCategoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategoriesAction(),
  });

  const gêtAllProductQuery = useQuery({
    queryKey: ["product", { page, size, sort, categoryId }],
    queryFn: () =>
      getProductByCategoryAction({
        categoryId,
        page: page - 1,
        size,
        sort: ["minPrice," + sort],
      }),
    enabled: !!categoryId,
  });

  return (
    <div>
      {/* Header */}
      <Header />
      <div className="flex  mx-auto">
        {/* Sidebar */}
        {gêtAllCategoryQuery && <Sidebar query={gêtAllCategoryQuery} />}
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Product Grid */}
          {gêtAllProductQuery && <Products query={gêtAllProductQuery} />}
          {/* Pagination only if there are products and more than 1 page */}
          <Pagination />
        </main>
      </div>
    </div>
  );
}
