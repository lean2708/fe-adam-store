"use client";
import ProductCardIndex from "@/components/modules/ProductCardIndex";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { TProduct } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "../detail/Pagination";
import { getAllProductsTotalAction } from "@/actions/productActions";
import { Skeleton } from "@/components/ui/skeleton";

export function ContentNews() {
  const t = useTranslations("Marketing");
  const [state, setState] = useState<{
    loading: boolean;
    value: string;
    page: number;
    maxPage: number;
    totalProducts: number;
    listProducts: TProduct[];
  }>({
    loading: true,
    value: "desc",
    page: 0,
    maxPage: 0,
    totalProducts: 0,
    listProducts: [],
  });
  useEffect(() => {
    const getProductByIdCategory = async () => {
      try {
        setState((ps) => ({ ...ps, loading: true }));
        const res = await getAllProductsTotalAction(state.page, 12, [
          "createdAt,desc",
          "minPrice," + state.value,
        ]);
        if (res.status) {
          setState((ps) => ({
            ...ps,
            totalProducts: res.data?.totalItem || 0,
            listProducts: res.data?.products || [],
            loading: false,
            maxPage: res.data?.totalItem
              ? Math.ceil(res.data.totalItem / 12)
              : 1,
          }));
        }
      } catch (error) {
        setState((ps) => ({ ...ps, loading: false }));
      }
    };
    getProductByIdCategory();
  }, [state.value, state.page]);
  console.log(state);
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState((ps) => ({ ...ps, value: event.target.value, page: 0 }));
  };
  return (
    <>
      <div className="w-full h-20 flex items-center justify-between">
        <p className="text-[#888888]">{Math.min(state.totalProducts, 5*12)} Sản phẩm</p>
        <p>
          <span className="text-[#888888]">Sắp xếp theo</span>
          <select
            className="outline-none"
            value={state.value}
            onChange={handleSortChange}
            name="sort"
            id="sort"
          >
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </p>
      </div>
      <div>
        <Carousel className="w-full">
          <div className="flex flex-wrap">
            {state.loading &&
              [1, 2, 3, 4].map((product) => (
                <CarouselItem
                  key={product}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4 mb-2"
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
            {state.listProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 mb-2"
              >
                <Link href={`product/${product.id}`}>
                  <ProductCardIndex
                    product={product}
                    badgeText={t("newestProducts.badgeText")}
                  />
                </Link>
              </CarouselItem>
            ))}
          </div>
        </Carousel>
      </div>
      <Pagination
        totalPage={state.maxPage}
        page={state.page}
        type="news"
        totalProduct={state.totalProducts}
        onChangePage={(val) => setState((ps) => ({ ...ps, page: val - 1 }))}
      />
    </>
  );
}
