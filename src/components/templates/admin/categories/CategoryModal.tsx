"use client";

import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { z } from "zod";
import { uploadImagesAction } from "@/actions/fileActions";
import { createCategoryAction, updateCategoryAction } from "@/actions/categoryActions";
import type { TCategory } from "@/types";

// Schema for category form
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  editingCategory: TCategory | null;
}

export function CategoryModal({ open, onClose, editingCategory }: CategoryModalProps) {
  const t = useTranslations("Admin.categories");
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      status: "ACTIVE",
    },
  });

  // Reset form when dialog opens/closes or editing category changes
  useEffect(() => {
    if (open) {
      if (editingCategory) {
        form.reset({
          name: editingCategory.name || "",
          status: (editingCategory.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
        });
      } else {
        form.reset({
          name: "",
          status: "ACTIVE",
        });
      }
      setSelectedImage(null);
    }
  }, [open, editingCategory, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      let imageUrl = "";
      
      // Upload image if selected
      if (selectedImage) {
        try {
          const uploadResult = await uploadImagesAction([selectedImage]);
          if (uploadResult.success && uploadResult.data && uploadResult.data.length > 0) {
            imageUrl = uploadResult.data[0].imageUrl || "";
          }
        } catch (error) {
          console.warn("Image upload failed, continuing without image:", error);
        }
      }
      
      const categoryData = {
        name: data.name,
        status: data.status,
        imageUrl: imageUrl,
      };
      
      const result = await createCategoryAction(categoryData);
      if (!result.success) {
        throw new Error(result.message || "Failed to create category");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success(t("categoryCreated") || "Category created successfully");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (!editingCategory) throw new Error("No category to update");
      
      let imageUrl = editingCategory.imageUrl || "";
      
      // Upload new image if selected
      if (selectedImage) {
        try {
          const uploadResult = await uploadImagesAction([selectedImage]);
          if (uploadResult.success && uploadResult.data && uploadResult.data.length > 0) {
            imageUrl = uploadResult.data[0].imageUrl || "";
          }
        } catch (error) {
          console.warn("Image upload failed, keeping existing image:", error);
        }
      }
      
      const categoryData = {
        name: data.name,
        status: data.status,
        imageUrl: imageUrl,
      };

      const result = await updateCategoryAction(parseInt(editingCategory.id), categoryData);
      if (!result.success) {
        throw new Error(result.message || "Failed to update category");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success(t("categoryUpdated") || "Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
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

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      variant="centered"
      size="md"
      showOverlay={true}
      closeOnClickOutside={false}
      className="bg-white rounded-lg shadow-xl"
    >
      <ModalHeader className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {editingCategory
              ? (t("editCategory") || "Chỉnh sửa danh mục")
              : (t("addCategory") || "Thêm danh mục")
            }
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </ModalHeader>

      <ModalBody className="p-6">

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("categoryName") || "Tên danh mục"}</Label>
            <Input
              id="name"
              placeholder={t("enterCategoryName") || "Nhập tên danh mục"}
              {...form.register("name")}
              className={form.formState.errors.name ? "border-red-500" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t("status") || "Trạng thái"}</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value: "ACTIVE" | "INACTIVE") => form.setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">{t("ACTIVE") || "Hoạt động"}</SelectItem>
                <SelectItem value="INACTIVE">{t("INACTIVE") || "Không hoạt động"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>{t("image") || "Hình ảnh"}</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {selectedImage 
                    ? selectedImage.name 
                    : editingCategory?.imageUrl 
                      ? (t("changeImage") || "Thay đổi hình ảnh")
                      : (t("uploadImage") || "Tải lên hình ảnh")
                  }
                </p>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isLoading}
            >
              {t("cancel") || "Hủy"}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? (t("saving") || "Đang lưu...")
                : editingCategory
                  ? (t("update") || "Cập nhật")
                  : (t("create") || "Tạo")
              }
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
