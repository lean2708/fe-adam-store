"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { ProductVariantEditModal } from "@/components/templates/admin/products/ProductVariantEditModal";
import { ProductUpdateModal } from "@/components/templates/admin/products/ProductUpdateModal";
import { ProductVariantsTableComponent } from "@/components/templates/admin/products/ProductVariantsTableComponent";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { fetchProductByIdAction } from "@/actions/productActions";
import { transformProductResponseToTProduct } from "@/lib/data/transform/product";
import Spinner from "@/components/ui/Spinner";

export default function ProductVariantsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const t = useTranslations("Admin.products");
  const locale = useLocale();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const result = await fetchProductByIdAction(parseInt(productId));
      if (!result.success) {
        throw new Error(result.message || "Failed to load product");
      }
      return transformProductResponseToTProduct(result.data || {});
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t("productNotFound") || "Product not found"}
          </h2>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back") || "Back"}
          </Button>
        </div>
      </div>
    );
  }

  // Extract all variants from all colors
  const allVariants =
    product.colors?.flatMap(
      (color) =>
        color.variants?.map((variant) => ({
          ...variant,
          colorName: color.name,
          colorId: color.id,
        })) || []
    ) || [];

  const handleEditVariant = (variant: any) => {
    setEditingVariant(variant);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVariant(null);
    // Refresh the product data when modal closes
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    // Refresh the product data when modal closes
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    // Refresh the product data when modal closes
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("refreshSuccess") || "Data refreshed successfully");
    } catch (error) {
      toast.error(t("refreshError") || "Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Callback for when variant operations succeed
  const handleVariantSuccess = () => {
    // Force refresh the product data to update the variants display
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <>
      <div className="space-y-6 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {t("refresh") || "Refresh"}
            </Button>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("productDetails") || "Product Details"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 bg-[#E8E8E8] flex items-center space-x-2"
                onClick={handleOpenUpdateModal}
              >
                <span>{t("editProduct") || "Edit Product"}</span>
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.3113 4.87846L14.1216 0.689705C13.9823 0.550381 13.8169 0.439861 13.6349 0.364458C13.4529 0.289054 13.2578 0.250244 13.0608 0.250244C12.8638 0.250244 12.6687 0.289054 12.4867 0.364458C12.3047 0.439861 12.1393 0.550381 12 0.689705L0.439695 12.25C0.299801 12.3888 0.188889 12.554 0.113407 12.736C0.0379245 12.9181 -0.000621974 13.1133 7.58901e-06 13.3103V17.5C7.58901e-06 17.8978 0.158043 18.2794 0.439347 18.5607C0.720652 18.842 1.10218 19 1.50001 19H17.25C17.4489 19 17.6397 18.921 17.7803 18.7803C17.921 18.6397 18 18.4489 18 18.25C18 18.0511 17.921 17.8603 17.7803 17.7197C17.6397 17.579 17.4489 17.5 17.25 17.5H7.81126L18.3113 7.00002C18.4506 6.86073 18.5611 6.69535 18.6365 6.51334C18.7119 6.33133 18.7507 6.13625 18.7507 5.93924C18.7507 5.74222 18.7119 5.54714 18.6365 5.36513C18.5611 5.18312 18.4506 5.01775 18.3113 4.87846ZM5.68969 17.5H1.50001V13.3103L9.75001 5.06033L13.9397 9.25002L5.68969 17.5ZM15 8.18971L10.8113 4.00002L13.0613 1.75002L17.25 5.93971L15 8.18971Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </div>
            {/* Product Images Carousel */}
            <div className="mb-8">
              {product.images && product.images.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {product.images.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
                      >
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                          <img
                            src={image.imageUrl || "/placeholder.png"}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border max-w-xs mx-auto">
                  <span className="text-gray-400 text-sm">
                    {t("noImagesAvailable") || "No images available"}
                  </span>
                </div>
              )}
            </div>

            {/* Product Details in Table Format */}
            <div className="space-y-0">
              {/* <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-600">
                    {t("category") || "Category"} :
                  </span>
                </div>
                <div className="col-span-9">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {product.category.name}
                  </span>
                </div>
              </div> */}

              <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-600">
                    {t("rating") || "Rating"} :
                  </span>
                </div>
                <div className="col-span-9">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-600">
                    {t("price") || "Price"} :
                  </span>
                </div>
                <div className="col-span-9">
                  <span className="text-sm text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(product.minPrice || 0, locale)} -{" "}
                    {formatCurrency(product.maxPrice || 0, locale)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-600">
                    {t("colors") || "Colors"} :
                  </span>
                </div>
                <div className="col-span-9">
                  <div className="flex flex-wrap gap-1">
                    {product.colors?.map((color, index) => (
                      <span
                        key={color.id}
                        className="inline-block text-sm text-gray-900 dark:text-white"
                      >
                        {color.name}
                        {index < (product.colors?.length || 0) - 1 && ", "}
                      </span>
                    )) || <span className="text-sm text-gray-500">N/A</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 py-3 ">
                <div className="col-span-3">
                  <span className="text-sm font-medium text-gray-600">
                    Size :
                  </span>
                </div>
                <div className="col-span-9">
                  <div className="flex flex-wrap gap-1">
                    {Array.from(
                      new Set(
                        product.colors?.flatMap(
                          (color) =>
                            color.variants
                              ?.map((variant) => variant.size?.name)
                              .filter(Boolean) || []
                        ) || []
                      )
                    ).map((size, index, array) => (
                      <span
                        key={size}
                        className="inline-block text-sm text-gray-900 dark:text-white"
                      >
                        {size}
                        {index < array.length - 1 && ", "}
                      </span>
                    )) || <span className="text-sm text-gray-500">N/A</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-bold text-black mb-3 dark:text-white">
                  {t("description") || "Product Description"}
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  {product.description.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Variants Table */}
        <ProductVariantsTableComponent
          handleOpenAddModal={handleOpenAddModal}
          variants={allVariants}
          productName={product.name || product.title || ""}
          onEditVariant={handleEditVariant}
        />
      </div>

      {/* Edit Modal */}
      <ProductVariantEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        variant={editingVariant}
        productName={product.name || product.title}
        productId={product.id}
        onSuccess={handleVariantSuccess}
      />

      {/* Add Modal */}
      <ProductVariantEditModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        variant={null} // null for creating new variant
        productName={product.name || product.title}
        productId={product.id}
        onSuccess={handleVariantSuccess}
      />

      {/* Update Product Modal */}
      <ProductUpdateModal
        open={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        product={product}
      />
    </>
  );
}
