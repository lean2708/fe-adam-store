"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  addBranchAction,
  updateBranchAction
} from "@/actions/branchActions";
import { branchSchema, type BranchFormData } from "@/actions/schema/branchSchema";
import type { TBranch } from "@/types";

interface BranchModalProps {
  open: boolean;
  onClose: () => void;
  editingBranch: TBranch | null;
}

export function BranchModal({ open, onClose, editingBranch }: BranchModalProps) {
  const t = useTranslations("Admin.branches");
  const queryClient = useQueryClient();

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      location: "",
      phone: ""
    }
  });

  // Update form data when editingBranch changes
  useEffect(() => {
    if (editingBranch) {
      form.reset({
        name: editingBranch.name || "",
        location: editingBranch.location || "",
        phone: editingBranch.phone || ""
      });
    } else {
      form.reset({
        name: "",
        location: "",
        phone: ""
      });
    }
  }, [editingBranch, form]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await addBranchAction(formData);
      if (!result.success) {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof BranchFormData, {
                type: "server",
                message: messages[0]
              });
            }
          });
        }
        throw new Error(result.message || "Failed to create branch");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Branch created successfully");
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateBranchAction(id, formData);
      if (!result.success) {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof BranchFormData, {
                type: "server",
                message: messages[0]
              });
            }
          });
        }
        throw new Error(result.message || "Failed to update branch");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Branch updated successfully");
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (values: BranchFormData) => {
    const formDataObj = new FormData();
    formDataObj.append("name", values.name);
    formDataObj.append("location", values.location);
    formDataObj.append("phone", values.phone);

    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, formData: formDataObj });
    } else {
      createMutation.mutate(formDataObj);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

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
            {editingBranch ? t("editBranch") : t("createNewBranch")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {editingBranch
              ? t("updateBranchInfo")
              : t("addNewBranch")
            }
          </p>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white">
            <div className="grid gap-4 py-6 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-gray-700 font-medium">
                      {t("name")}
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          placeholder={t("branchName")}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-gray-700 font-medium">
                      {t("location")}
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          placeholder={t("address")}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-gray-700 font-medium">
                      {t("phone")}
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          placeholder={t("phoneNumber")}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose} className="bg-white">
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending || form.formState.isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingBranch ? t("update") : t("create")}
              </Button>
            </div>
          </form>
        </Form>
      </ModalBody>
    </Modal>
  );
}
