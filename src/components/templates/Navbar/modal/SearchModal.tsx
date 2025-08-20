"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { searchProductsAction } from "@/actions/productActions";
import { TProduct } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
  searchQuery?: string;
  isSearchExpanded?: boolean;
};

export default function SearchModal({
  open,
  onClose,
  searchQuery = "",
  isSearchExpanded = false,
}: SearchModalProps) {
  const router = useRouter();
  const t = useTranslations("Marketing");
  const locale = useLocale();
  const [searchResults, setSearchResults] = useState<TProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // hàm search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await searchProductsAction(
        0,
        5,
        ["createdAt,desc"],
        [`name~${query}`]
      );
      if (response.status === 200 && response.products) {
        setSearchResults(response.products);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // trigger search khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, performSearch]);

  return (
    <Modal
      data-search-modal
      open={open}
      onClose={onClose}
      variant="centered"
      size="xl"
      showOverlay={true}
      closeOnClickOutside={!isSearchExpanded}
    >
      <ModalBody style={{ maxHeight: "70vh" }}>
        <div className="mb-4 font-semibold text-lg">
          Kết quả tìm kiếm
          {searchQuery && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              cho "{searchQuery}"
            </span>
          )}
        </div>

        {!searchQuery.trim() ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500 text-lg">
              Vui lòng nhập từ khóa tìm kiếm
            </p>
          </div>
        ) : isSearching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500 text-lg">Không có sản phẩm nào cả</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {searchResults.map((item) => {
              const hasImageError = imageErrors[item.id] || false;
              const imageSrc = hasImageError ? "/fallback.png" : item.mainImage;
              const title = item.name || item.title;
              const price = item.colors?.[0]?.variants?.[0]?.price || 0;

              const handleImageError = () => {
                setImageErrors((prev) => ({ ...prev, [item.id]: true }));
              };

              return (
                <Card
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/product/${item.id}`);
                    onClose();
                  }}
                >
                  <CardContent className="p-0 pb-6">
                    <div className="aspect-[3/4] adam-store-bg-light rounded-lg overflow-hidden relative flex items-center justify-center">
                      <AspectRatio ratio={3 / 4}>
                        <Image
                          className="w-full h-full object-cover rounded-[4px]"
                          src={imageSrc || "/fallback.png"}
                          alt={title || "Product"}
                          width={300}
                          height={400}
                          onError={handleImageError}
                        />
                      </AspectRatio>
                    </div>
                  </CardContent>
                  <div className="text-center text-sm">{title}</div>
                  <div className="mt-2 text-center text-sm font-bold">
                    {formatCurrency(price, locale)}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </ModalBody>

      <ModalFooter sticky={true}>
        {!isSearching &&
          searchResults.length === 5 &&
          searchQuery.trim() !== "" && (
            <div className="flex items-center justify-center w-full">
              <Button
                className="cursor-pointer bg-black text-white px-6 py-2 rounded-md"
                onClick={() => {
                  router.push(
                    `/search?query=${encodeURIComponent(searchQuery)}`
                  );
                  onClose();
                }}
              >
                Xem thêm
              </Button>
            </div>
          )}
      </ModalFooter>
    </Modal>
  );
}
