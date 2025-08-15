"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  deleteProductAdminAction,
  restoreProductAction,
  fetchAllProductsForAdminAction,
  searchProductsAction
} from "@/actions/productActions";
import type { TProduct } from "@/types";
import type { ProductResponse } from "@/api-client/models";

// Transform ProductResponse to TProduct
function transformProductResponseToTProduct(product: ProductResponse): TProduct {
  return {
    id: product.id || 0,
    title: product.name || '',
    name: product.name,
    description: product.description,
    averageRating: product.averageRating,
    soldQuantity: product.soldQuantity,
    totalReviews: product.totalReviews,
    status: product.status,
    createdAt: product.createdAt,
    isAvailable: product.isAvailable,
    mainImage: product.images?.[0]?.imageUrl || '',
    images: product.images,
    colors: product.variants ? product.variants.map(variant => ({
      id: variant.color?.id || 0,
      name: variant.color?.name || '',
      variants: [{
        id: variant.id,
        price: variant.price,
        quantity: variant.quantity,
        isAvailable: variant.isAvailable,
        status: variant.status,
        size: variant.size
      }]
    })) : []
  };
}

export function useProducts(
  page: number = 0,
  size: number = 20,
  searchTerm: string = ""
) {
  const t = useTranslations("Admin.products");
  const queryClient = useQueryClient();

  // Query for fetching products
  const {
    data: productData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['products', page, size, searchTerm],
    queryFn: async () => {
      let result;

      if (searchTerm.trim()) {
        // Use search API when there's a search term
        const searchCriteria = [`name~${searchTerm.trim()}`];
        result = await searchProductsAction(page, size, ["id,desc"], searchCriteria);

        if (result.status !== 200) {
          throw new Error("Failed to search products");
        }

        const products = result.products || [];

        return {
          items: products,
          totalItems: products.length,
          totalPages: Math.ceil(products.length / size),
          page: page,
          size: size
        };
      } else {
        // Use regular fetch when no search term
        result = await fetchAllProductsForAdminAction(page, size, ["id,desc"]);

        if (!result.success) {
          throw new Error(result.message || "Failed to load products");
        }

        const products = result.data?.items || [];

        // Transform products to TProduct format
        const transformedProducts: TProduct[] = products.map(product =>
          transformProductResponseToTProduct(product)
        );

        return {
          items: transformedProducts,
          totalItems: result.data?.totalItems || 0,
          totalPages: result.data?.totalPages || 0,
          page: result.data?.page || 0,
          size: result.data?.size || size
        };
      }
    },
  });

  // Delete mutation (deletes product)
  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const result = await deleteProductAdminAction(productId);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete product");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      console.log("Error deleting product:", error);
      toast.error(error.message);
    },
  });

  // Restore mutation (restores product)
  const restoreMutation = useMutation({
    mutationFn: async (productId: number) => {
      const result = await restoreProductAction(productId);
      if (!result.success) {
        throw new Error(result.message || "Failed to restore product");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Product restored successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      console.log("Error restoring product:", error);
      toast.error(error.message);
    },
  });

  const handleDelete = (productId: number) => {
    if (confirm(t("deleteProductConfirm") || "Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  const handleRestore = (productId: number) => {
    if (confirm(t("restoreProductConfirm") || "Are you sure you want to restore this product?")) {
      restoreMutation.mutate(productId);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return {
    products: productData?.items || [],
    totalElements: productData?.totalItems || 0,
    totalPages: productData?.totalPages || 0,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
    isDeleting: deleteMutation.isPending,
    isRestoring: restoreMutation.isPending
  };
}
