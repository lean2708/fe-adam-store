"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Modal, ModalBody } from "@/components/ui/modal";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPromotionAction, updatePromotionAction } from "@/actions/promotionActions";
import type { TPromotion, TPromotionRequest } from "@/types";
import type { PromotionUpdateRequest } from "@/api-client/models";

interface PromotionModalProps {
  open: boolean;
  onClose: () => void;
  editingPromotion: TPromotion | null;
}

export function PromotionModal({ open, onClose, editingPromotion }: PromotionModalProps) {
  const t = useTranslations("Admin.promotions");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercent: 0,
    startDate: "",
    endDate: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE"
  });

  // Reset form when dialog opens/closes or editing promotion changes
  useEffect(() => {
    if (editingPromotion) {
      setFormData({
        code: editingPromotion.code || "",
        description: editingPromotion.description || "",
        discountPercent: editingPromotion.discountPercent || 0,
        startDate: editingPromotion.startDate || "",
        endDate: editingPromotion.endDate || "",
        status: editingPromotion.status || "ACTIVE"
      });
    } else {
      setFormData({
        code: "",
        description: "",
        discountPercent: 0,
        startDate: "",
        endDate: "",
        status: "ACTIVE"
      });
    }
  }, [editingPromotion, open]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: TPromotionRequest) => {
      const result = await createPromotionAction(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create promotion");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success(t("promotionCreatedSuccess"));
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PromotionUpdateRequest }) => {
      const result = await updatePromotionAction(parseInt(id), data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update promotion");
      }
      return result.data;

    },
    onSuccess: () => {
      toast.success(t("promotionUpdatedSuccess"));
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.code.trim()) {
      toast.error(t("codeRequired"));
      return;
    }

    if (formData.discountPercent < 0 || formData.discountPercent > 100) {
      toast.error(t("invalidDiscountPercent"));
      return;
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error(t("invalidDateRange"));
      return;
    }

    const promotionData = {
      code: formData.code,
      description: formData.description,
      discountPercent: formData.discountPercent,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status
    };

    if (editingPromotion) {
      updateMutation.mutate({ id: editingPromotion.id.toString(), data: promotionData });
    } else {
      createMutation.mutate(promotionData as TPromotionRequest);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="centered"
      size="xl"
      showOverlay={true}
      closeOnClickOutside={false}
      showCloseButton={true}
      className="bg-white rounded-lg shadow-xl"
    >
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingPromotion ? t("editPromotion") : t("addPromotion")}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {editingPromotion ? t("editPromotionDescription") : t("addPromotionDescription")}
        </p>
      </div>

      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code and Discount Percent Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã giảm giá *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Nhập mã giảm giá"
                className="bg-gray-100 border-0 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercent">Phần trăm giảm *</Label>
              <Input
                id="discountPercent"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
                placeholder="Nhập phần trăm giảm"
                className="bg-gray-100 border-0 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả"
              rows={3}
              className="bg-gray-100 border-0 rounded-lg"
            />
          </div>

          {/* Start Date and End Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-gray-100 border-0 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-gray-100 border-0 rounded-lg"
              />
            </div>
          </div>

          {/* <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "ACTIVE"}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? "ACTIVE" : "INACTIVE" }))}
            />
            <Label htmlFor="status">{t("activeStatus")}</Label>
          </div> */}

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading}
              className="px-8 py-3 bg-gray-200 border-0 text-gray-700 hover:bg-gray-300 rounded-lg"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg"
            >
              {isLoading ? "Đang lưu..." : (editingPromotion ? "Cập nhật" : "Xác nhận")}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
