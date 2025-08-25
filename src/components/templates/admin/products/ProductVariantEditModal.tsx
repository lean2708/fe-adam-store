"use client";

import { useEffect } from "react";
import { Modal, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


import { z } from "zod";
import { updateProductVariantAction, addProductVariantAction } from "@/actions/productVariantActions";
import { fetchAllColorsAction } from "@/actions/colorActions";
import { fetchAllSizesAction } from "@/actions/sizeActions";
import type { TColor, TSize } from "@/types";

// Schema for variant editing
const variantEditSchema = z.object({
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  colorId: z.number().min(1, "Please select a color"),
  sizeId: z.number().min(1, "Please select a size"),
});



type VariantEditFormData = z.infer<typeof variantEditSchema>;

interface ProductVariantEditModalProps {
  open: boolean;
  onClose: () => void;
  variant: {
    id: number;
    price?: number;
    quantity?: number;
    colorName?: string;
    colorId?: number;
    size?: { id?: number; name?: string };
  } | null;
  productName?: string;
  productId?: number;
  onAddNewVariant?: () => void;
  onSuccess?: () => void; // Callback for successful operations
}

export function ProductVariantEditModal({
  open,
  onClose,
  variant,
  productId,
  onSuccess
}: ProductVariantEditModalProps) {
  const t = useTranslations("Admin.products");
  const queryClient = useQueryClient();

  const form = useForm<VariantEditFormData>({
    resolver: zodResolver(variantEditSchema),
    defaultValues: {
      price: 0,
      quantity: 0,
      colorId: 0,
      sizeId: 0,
    },
  });

  // Fetch colors
  const { data: colorsData } = useQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const result = await fetchAllColorsAction();
      return result.success ? result.data : [];
    },
  });

  // Fetch sizes
  const { data: sizesData } = useQuery({
    queryKey: ['sizes'],
    queryFn: async () => {
      const result = await fetchAllSizesAction();
      return result.success ? result.data : [];
    },
  });

  const colors: TColor[] = Array.isArray(colorsData)
    ? colorsData
    : (colorsData as unknown as { items?: TColor[] })?.items || [];
  const sizes: TSize[] = Array.isArray(sizesData)
    ? sizesData
    : (sizesData as unknown as { items?: TSize[] })?.items || [];

  // Update form when variant changes
  useEffect(() => {
    if (variant) {
      // Edit mode - populate with existing variant data
      form.reset({
        price: variant.price || 0,
        quantity: variant.quantity || 0,
        colorId: variant.colorId || 0,
        sizeId: variant.size?.id || 0,
      });
    } else {
      // Create mode - reset to default values
      form.reset({
        price: 0,
        quantity: 0,
        colorId: 0,
        sizeId: 0,
      });
    }
  }, [variant, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: VariantEditFormData) => {
      if (!variant) throw new Error("No variant to update");

      const formData = new FormData();
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      formData.append('colorId', data.colorId.toString());
      formData.append('sizeId', data.sizeId.toString());

      const result = await updateProductVariantAction(variant.id, formData);
      if (!result.success) {
        throw new Error(result.message || "Failed to update variant");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Variant updated successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess?.(); // Call the success callback to refresh parent modal
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Create mutation for new variants
  const createMutation = useMutation({
    mutationFn: async (data: VariantEditFormData) => {
      if (!productId) throw new Error("Product ID is required");

      const formData = new FormData();
      formData.append('productId', productId.toString());
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      formData.append('colorId', data.colorId.toString());
      formData.append('sizeId', data.sizeId.toString());

      const result = await addProductVariantAction(formData);
      if (!result.success) {
        throw new Error(result.message || "Failed to create variant");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("New variant created successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess?.(); // Call the success callback to refresh parent modal
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: VariantEditFormData) => {
    if (variant) {
      // Update existing variant
      updateMutation.mutate(data);
    } else {
      // Create new variant
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Don't return null - we want to show the modal for both create and edit modes

  return (
    <Modal
      open={open}
      onClose={handleClose}
      variant="centered"
      size="md"
      showOverlay={true}
      closeOnClickOutside={true}
      showCloseButton={true}
    >
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          {variant
            ? t("editVariantTitle") || "Sửa biến thể sản phẩm"
            : t("addVariantTitle") || "Thêm biến thể sản phẩm"}
        </h2>
      </div>

      <ModalBody>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Size and Color Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("size") || "Size"}
              </Label>
              <Select
                value={form.watch("sizeId")?.toString() || ""}
                onValueChange={(value) =>
                  form.setValue("sizeId", parseInt(value))
                }
                key={form.watch("sizeId")?.toString() || ""}
              >
                <SelectTrigger
                  className={`bg-[#F0F0F0] rounded-xl h-10 ${
                    form.formState.errors.sizeId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size: TSize) => (
                    <SelectItem key={size.id} value={size.id.toString()}>
                      {size.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.sizeId && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.sizeId.message}
                </p>
              )}
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("color") || "Màu sắc"}
              </Label>
              <Select
                value={form.watch("colorId")?.toString() || ""}
                onValueChange={(value) =>
                  form.setValue("colorId", parseInt(value))
                }
                key={form.watch("colorId")?.toString()}
              >
                <SelectTrigger
                  className={`bg-[#F0F0F0] rounded-xl h-10 ${
                    form.formState.errors.colorId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Màu sắc" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color: TColor) => (
                    <SelectItem key={color.id} value={color.id.toString()}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.colorId && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.colorId.message}
                </p>
              )}
            </div>
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                {t("price") || "Giá"}
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Nhập giá"
                  {...form.register("price", { valueAsNumber: true })}
                  className={`bg-[#F0F0F0] rounded-xl h-10 ${
                    form.formState.errors.price ? "border-red-500" : ""
                  }`}
                />
              </div>
              {form.formState.errors.price && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                {t("quantity") || "Số lượng"}
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Số lượng"
                {...form.register("quantity", { valueAsNumber: true })}
                className={`bg-[#F0F0F0] rounded-xl h-10 ${
                  form.formState.errors.quantity ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.quantity && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t("cancel") || "Hủy bỏ"}
            </Button>
            <Button
              type="submit"
              disabled={
                variant ? updateMutation.isPending : createMutation.isPending
              }
              className="px-6 py-2 bg-black hover:bg-gray-800 text-white"
            >
              {variant
                ? updateMutation.isPending
                  ? t("saving") || "Đang lưu..."
                  : t("confirm") || "Xác nhận"
                : createMutation.isPending
                ? t("saving") || "Đang lưu..."
                : t("confirm") || "Xác nhận"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
