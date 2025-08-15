"use client";

import { useState } from "react";
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
import type { TColor, TSize, TCategory, TProductRequest, TVariantRequest } from "@/types";
import { createProductAdminAction } from "@/actions/productActions";

// Schema for product creation
const productCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.number().min(1, "Please select a category"),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  colorId: z.number().min(1, "Please select a color"),
  sizeId: z.number().min(1, "Please select a size"),
});

type ProductCreateFormData = z.infer<typeof productCreateSchema>;

interface ProductCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProductCreateModal({ open, onClose }: ProductCreateModalProps) {
  const t = useTranslations("Admin.products");
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<ProductCreateFormData>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
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

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await fetchAllCategoriesForAdminAction();
      return result.success ? result.data : [];
    },
  });

  const colors = Array.isArray(colorsData) ? colorsData : ((colorsData as any)?.items || []);
  const sizes = Array.isArray(sizesData) ? sizesData : ((sizesData as any)?.items || []);
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProductCreateFormData) => {
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

      // Create variant request
      const variant: TVariantRequest = {
        colorId: data.colorId,
        sizeId: data.sizeId,
        price: data.price,
        quantity: data.quantity,
      };

      // Create product request
      const productRequest: TProductRequest = {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        imageIds: imageIds,
        variants: [variant],
      };

      const result = await createProductAdminAction(productRequest);
      if (!result.success) {
        throw new Error(result.message || "Failed to create product");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success(t("productCreated") || "Product created successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: ProductCreateFormData) => {
    createMutation.mutate(data);
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
            {t("addProductTitle") || "Thêm sản phẩm"}
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
          Thêm sản phẩm
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
                  <SelectValue placeholder="Nhập tên danh mục" />
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
              placeholder="Nhập tên danh mục"
              {...form.register("description")}
              className={`bg-[#F0F0F0] rounded-xl min-h-[80px] ${
                form.formState.errors.description ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm text-gray-700">
                Giá
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Nhập giá"
                {...form.register("price", { valueAsNumber: true })}
                className={`bg-[#F0F0F0] rounded-xl h-12 ${
                  form.formState.errors.price ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.price && (
                <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm text-gray-700">
                Số lượng
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Nhập số lượng"
                {...form.register("quantity", { valueAsNumber: true })}
                className={`bg-[#F0F0F0] rounded-xl h-12 ${
                  form.formState.errors.quantity ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.quantity && (
                <p className="text-xs text-red-500">{form.formState.errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Size, Color and Image Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Size and Color + Status */}
            <div className="space-y-6">
              {/* Size and Color Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Size</Label>
                  <Select
                    value={form.watch("sizeId")?.toString() || ""}
                    onValueChange={(value) => form.setValue("sizeId", parseInt(value))}
                  >
                    <SelectTrigger className={`bg-[#F0F0F0] rounded-xl h-12 ${
                      form.formState.errors.sizeId ? "border-red-500" : ""
                    }`}>
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
                    <p className="text-xs text-red-500">{form.formState.errors.sizeId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Màu sắc</Label>
                  <Select
                    value={form.watch("colorId")?.toString() || ""}
                    onValueChange={(value) => form.setValue("colorId", parseInt(value))}
                  >
                    <SelectTrigger className={`bg-[#F0F0F0] rounded-xl h-12 ${
                      form.formState.errors.colorId ? "border-red-500" : ""
                    }`}>
                      <SelectValue placeholder="ALL" />
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
                    <p className="text-xs text-red-500">{form.formState.errors.colorId.message}</p>
                  )}
                </div>
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-700">Trạng thái</Label>
                <Input
                  placeholder="Nhập trạng thái"
                  className="bg-[#F0F0F0] rounded-xl h-12"
                  defaultValue="Active"
                />
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">Hình ảnh</Label>
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
                    {selectedImage ? selectedImage.name : "Tải hình ảnh lên"}
                  </p>
                </label>
              </div>
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
              disabled={createMutation.isPending}
              className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg"
            >
              {createMutation.isPending ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
