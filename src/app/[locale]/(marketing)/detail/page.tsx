"use client";

import { useEffect, useState } from "react";
import {
  getAllCategoriesAction,
  getProductByCategoryAction,
} from "@/actions/categoryActions";
import Header from "@/components/templates/(marketing)/detail/Header";
import Sidebar from "@/components/templates/(marketing)/detail/Sidebar";
import ProductGrid from "@/components/templates/(marketing)/detail/ProductGrid";
import Pagination from "@/components/templates/(marketing)/detail/Pagination";
import { TCategory } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { ApiResponsePageResponseProductResponse } from "@/api-client";
import { transformProductResponseToTProduct } from "@/lib/data/transform/product";

export default function AoPoloStore() {
  const [sortBy, setSortBy] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null
  );
  const [items, setItems] = useState<ApiResponsePageResponseProductResponse>();
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get page and limit from searchParams, default page=1, limit=10
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = limitParam ? parseInt(limitParam, 10) : 10;

  // categories state
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Track if categories fetch failed or empty
  const [categoriesError, setCategoriesError] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(false);
        const response = await getAllCategoriesAction();
        if (
          response.status === 200 &&
          response.categories &&
          response.categories.length > 0
        ) {
          setCategories(
            response.categories.map((cat: any) => ({
              ...cat,
              id: String(cat.id),
            }))
          );
          // Set default selected category to the first one if not set
          if (selectedCategory === null) {
            setSelectedCategory({
              ...response.categories[0],
              id: String(response.categories[0].id),
            });
          }
        } else {
          setCategories([]);
          setCategoriesError(true);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
        setCategoriesError(true);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch items by selected category, page, limit, sort
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getProductByCategoryAction({
          page: currentPage - 1,
          size: pageSize,
          categoryId: selectedCategory?.id || "1",
          sort: [`minPrice,${sortBy}`],
        });
        if (data) {
          setItems(data.items);
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setItems(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) {
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, currentPage, pageSize]);

  // Handlers
  const handleCategorySelect = (category: TCategory) => {
    setSelectedCategory(category);
    // Reset page to 1 when changing category
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Reset page to 1 when changing sort
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`);
    // No need to setCurrentPage, as currentPage is derived from searchParams
  };

  // Always render the layout, even if no products
  if (
    categoriesLoading ||
    categoriesError ||
    !selectedCategory ||
    categories.length === 0
  ) {
    return null;
  }

  // Prepare products array (may be empty)
  const products =
    items && items.result && items.result.items
      ? items.result.items.map(transformProductResponseToTProduct)
      : [];

  return (
    <div>
      {/* Header */}
      <Header
        currentCategory={selectedCategory}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      <div className="flex  mx-auto">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          categoriesLoading={categoriesLoading}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Product Grid */}
          <ProductGrid products={products} loading={loading} />

          {/* Pagination only if there are products and more than 1 page */}
          {items &&
            items.result &&
            items.result.totalItems &&
            items.result.totalPages &&
            products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={items.result.totalPages}
                itemsCount={items.result.totalItems}
                onPageChange={handlePageChange}
              />
            )}
        </main>
      </div>
    </div>
  );
}
