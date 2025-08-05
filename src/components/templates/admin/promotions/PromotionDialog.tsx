"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPromotionAction, updatePromotionAction } from "@/actions/promotionActions";
import type { TPromotion } from "@/types";
import type { PromotionRequest, PromotionUpdateRequest } from "@/api-client/models";

interface PromotionDialogProps {
  open: boolean;
  onClose: () => void;
  editingPromotion: TPromotion | null;
}

export function PromotionDialog({ open, onClose, editingPromotion }: PromotionDialogProps) {
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
    mutationFn: async (data: PromotionRequest) => {
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
      createMutation.mutate(promotionData as PromotionRequest);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingPromotion ? t("editPromotion") : t("addPromotion")}
          </DialogTitle>
          <DialogDescription>
            {editingPromotion ? t("editPromotionDescription") : t("addPromotionDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">{t("code")} *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder={t("codePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountPercent">{t("discountPercent")} *</Label>
            <Input
              id="discountPercent"
              type="number"
              min="0"
              max="100"
              value={formData.discountPercent}
              onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t("startDate")}</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{t("endDate")}</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "ACTIVE"}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? "ACTIVE" : "INACTIVE" }))}
            />
            <Label htmlFor="status">{t("activeStatus")}</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("saving") : (editingPromotion ? t("updatePromotion") : t("createPromotion"))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
