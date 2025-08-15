"use client";

import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { z } from "zod";
import { fetchAllColorsAction } from "@/actions/colorActions";
import { fetchAllSizesAction } from "@/actions/sizeActions";
import { fetchAllCategoriesForAdminAction } from "@/actions/categoryActions";
import { uploadImagesAction } from "@/actions/fileActions";
import type { TColor, TSize, TCategory, TProduct } from "@/types";
import { updateProductAdminAction } from "@/actions/productActions";
import type { ProductUpdateRequest } from "@/api-client/models";

// Schema for product update
const productUpdateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.number().min(1, "Please select a category"),
});

type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;

interface ProductUpdateModalProps {
  open: boolean;
  onClose: () => void;
  product: TProduct | null;
}

export function ProductUpdateModal({ open, onClose, product }: ProductUpdateModalProps) {
  const t = useTranslations("Admin.products");
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<ProductUpdateFormData>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name || product.title || "",
        description: product.description || "",
        categoryId: 0, // Will be set when categories are loaded
      });
    }
  }, [product, open, form]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
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

      let imageIds: number[] = [];

      // Upload image if selected
      if (selectedImage) {
        try {
          const uploadResult = await uploadImagesAction([selectedImage]);
          if (uploadResult.success && uploadResult.data) {
            imageIds = uploadResult.data.map((file: any) => file.id);
          }
        } catch (error) {
          console.warn("Image upload failed, continuing without image:", error);
        }
      }

      // Create product update request
      const productUpdateRequest: ProductUpdateRequest = {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        ...(imageIds.length > 0 && { imageIds }),
      };

      const result = await updateProductAdminAction(product.id, productUpdateRequest);
      if (!result.success) {
        throw new Error(result.message || "Failed to update product");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success(t("productUpdated") || "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: ProductUpdateFormData) => {
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setSelectedImage(null);
    onClose();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  if (!product) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      variant="centered"
      size="xl"
      showOverlay={true}
      closeOnClickOutside={true}
    >
      <ModalHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t("updateProductTitle") || "Cập nhật sản phẩm"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </ModalHeader>

      <ModalBody className="p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-8">
          Cập nhật sản phẩm
        </h2>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Product Name and Category Row */}
          <div className="grid grid-cols-2 gap-6">
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
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-700">Danh mục</Label>
              <Select
                value={form.watch("categoryId")?.toString() || ""}
                onValueChange={(value) => form.setValue("categoryId", parseInt(value))}
              >
                <SelectTrigger className={`bg-[#F0F0F0] rounded-xl h-12 ${
                  form.formState.errors.categoryId ? "border-red-500" : ""
                }`}>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: TCategory) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-xs text-red-500">{form.formState.errors.categoryId.message}</p>
              )}
            </div>
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
              <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Image Section */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">Hình ảnh (tùy chọn)</Label>
            <div className="bg-gray-100 border-0 rounded-lg p-8 text-center h-38 flex flex-col justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  {selectedImage ? selectedImage.name : "Tải hình ảnh lên (tùy chọn)"}
                </p>
              </label>
            </div>
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
            >
              {updateMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
