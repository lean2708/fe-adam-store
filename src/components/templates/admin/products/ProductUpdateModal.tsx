"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { fetchAllCategoriesForAdminAction } from "@/actions/categoryActions";
import { uploadImagesAction } from "@/actions/fileActions";
import type { TCategory, TProduct } from "@/types";
import { updateProductAdminAction } from "@/actions/productActions";
import type { ProductUpdateRequest } from "@/api-client/models";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";

// Schema for product update
const productUpdateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
});

type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;

interface ProductUpdateModalProps {
  open: boolean;
  onClose: () => void;
  product: TProduct | null;
}

export function ProductUpdateModal({
  open,
  onClose,
  product,
}: ProductUpdateModalProps) {
  const t = useTranslations("Admin.products");
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const form = useForm<ProductUpdateFormData>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
      // categoryId: 0,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name || product.title || "",
        description: product.description || "",
        // categoryId: product.category.id, // Will be set when categories are loaded
      });
    }
  }, [product, open, form]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await fetchAllCategoriesForAdminAction();
      return result.success ? result.data : [];
    },
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ProductUpdateFormData) => {
      if (!product) throw new Error("No product to update");

      let newImageIds: number[] = [];

      // Upload new images if any
      if (selectedImages.length > 0) {
        try {
          const uploadResult = await uploadImagesAction(selectedImages);
          if (uploadResult.success && uploadResult.data) {
            newImageIds = uploadResult.data.map((file: any) => file.id);
          }
        } catch (error) {
          console.warn("Image upload failed, proceeding without new images:", error);
        }
      }

      // Create product update request
      const productUpdateRequest: ProductUpdateRequest = {
        name: data.name,
        description: data.description,
        imageIds: newImageIds,
        deleteImageIds: imagesToDelete,
      };

      const result = await updateProductAdminAction(
        product.id,
        productUpdateRequest
      );
      if (!result.success) {
        throw new Error(result.message || "Failed to update product");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success(t("productUpdated") || "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ProductUpdateFormData) => {
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setSelectedImages([]);
    setImagesToDelete([]);
    onClose();
  };

  const handleRemoveInitialImage = (id: number) => {
    setImagesToDelete((prev) => [...prev, id]);
  };

  if (!product) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      variant="centered"
      size="xl"
      showOverlay={true}
      closeOnClickOutside={!isDropdownOpen}
      showCloseButton={true}
    >
      <ModalBody className="p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-8">
          {t("updateProductTitle")}
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name and Category Row */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-700">
                Tên sản phẩm
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên sản phẩm"
                {...form.register("name")}
                className={`bg-[#F0F0F0] rounded-xl h-12 ${
                  form.formState.errors.name ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label className="text-sm text-gray-700">Danh mục</Label>
              <Select
                value={form.watch("categoryId")?.toString() || ""}
                key={form.watch("categoryId")?.toString() || ""}
                onValueChange={(value) =>
                  form.setValue("categoryId", parseInt(value))
                }
                onOpenChange={setIsDropdownOpen}
              >
                <SelectTrigger
                  className={`bg-[#F0F0F0] rounded-xl h-12 ${
                    form.formState.errors.categoryId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: TCategory) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div> */}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-700">
              Mô tả
            </Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả sản phẩm"
              {...form.register("description")}
              className={`bg-[#F0F0F0] rounded-xl min-h-[80px] ${
                form.formState.errors.description ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Image Section */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">Hình ảnh</Label>
            <MultiImageUpload
              onChange={setSelectedImages}
              initialImageUrls={product?.images
                ?.filter((img): img is { id: number; imageUrl?: string } =>
                  typeof img.id === 'number' && !imagesToDelete.includes(img.id)
                )
                .map(img => ({ id: img.id, url: img.imageUrl || '' })) || []}
              onRemoveInitialImage={handleRemoveInitialImage}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="px-8 py-3 bg-gray-200 border-0 text-gray-700 hover:bg-gray-300 rounded-lg"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg"
              onClick={() => console.log("CLICK SUBMIT")}
            >
              {updateMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
