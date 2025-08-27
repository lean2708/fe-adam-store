"use client";
import { searchAllProductsAction } from "@/actions/productActions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "../detail/Pagination";
import { TProduct } from "@/types";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import ProductCardIndex from "@/components/modules/ProductCardIndex";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { SideSearch } from "./SideSearch";
const priceFilters = [
  [`minPrice<500000`],
  [`minPrice>500000`, `minPrice<1000000`],
  [`minPrice>1000000`],
];
export default function ContentSearch() {
  const t = useTranslations("Marketing");
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const decoded = query ? decodeURIComponent(query) : "";
  const [state, setState] = useState<{
    loading: boolean;
    color?: number;
    minPrice?: number;
    sort?: string;
    page: number;
    totalPage: number;
    totalProduct: number;
    listProducts: TProduct[];
  }>({
    loading: true,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    color: searchParams.get("color")
      ? Number(searchParams.get("color"))
      : undefined,
    sort: searchParams.get("sort") ? String(searchParams.get("sort")) : "desc",
    page: 0,
    totalPage: 0,
    totalProduct: 0,
    listProducts: [],
  });
  useEffect(() => {
    const color = searchParams.get("color")
      ? Number(searchParams.get("color"))
      : undefined;
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const sort = searchParams.get("sort") ?? "desc";

    setState((ps) => ({
      ...ps,
      loading: true,
      color,
      minPrice,
      sort,
    }));
  }, [searchParams]);
  useEffect(() => {
    const searchProduct = async () => {
      try {
        setState((ps) => ({ ...ps, loading: true }));
        const filters: string[] = [];
        if (state.color) filters.push(`colorId=${state.color}`);
        if (state.minPrice) filters.push(...priceFilters[state.minPrice - 1]);
        const res = await searchAllProductsAction(
          state.page,
          15,
          [`minPrice,${state.sort}`],
          [`name~${query}`, ...filters]
        );
        console.log({
          page: state.page,
          sort: [`minPrice,${state.sort}`],
          search: [`name~${query}`, ...filters],
        });
        if (res.status === 200) {
          setState((ps) => ({
            ...ps,
            totalPage: res.data?.totalPages || 0,
            totalProduct: res.data?.totalItems || 0,
            listProducts: res.data?.items || [],
          }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setState((ps) => ({ ...ps, loading: false }));
      }
    };
    if (query) searchProduct();
  }, [state.page, state.minPrice, state.color, state.sort, query]);
  return (
    <div className="w-full flex">
      <SideSearch result={state.totalProduct} />
      <div className="w-[85%]">
        <Carousel className="w-full">
          <div className="flex flex-wrap">
            {state.loading &&
              [1, 2, 3, 4, 5].map((product) => (
                <CarouselItem
                  key={product}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/5 mb-2"
                >
                  <Skeleton className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3"></Skeleton>
                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3].map((color) => (
                      <Skeleton
                        key={color}
                        style={{
                          width: "50px",
                          height: "29px",
                          borderRadius: "100px",
                          opacity: 1,
                        }}
                      />
                    ))}
                  </div>
                  <Skeleton className="h-6 w-full mb-3"></Skeleton>
                  <Skeleton className="h-6 w-[45%]"></Skeleton>
                </CarouselItem>
              ))}
            {!state.loading && state.listProducts.length === 0 && (
              <div className="w-full">
                <p className="w-full text-center">
                  Không có sản phẩm phù hợp nào cả
                </p>
              </div>
            )}
            {!state.loading &&
              state.listProducts.length !== 0 &&
              state.listProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/5 mb-2"
                >
                  <ProductCardIndex
                    product={product}
                    badgeText={t("bestSellers.badgeText")}
                  />
                </CarouselItem>
              ))}
          </div>
        </Carousel>
        <Pagination
          totalPage={state.totalPage}
          page={state.page}
          totalProduct={state.totalProduct}
          onChangePage={(val) => setState((ps) => ({ ...ps, page: val - 1 }))}
        />
      </div>
    </div>
  );
}
