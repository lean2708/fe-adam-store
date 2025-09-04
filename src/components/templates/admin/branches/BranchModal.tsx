"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalBody } from "@/components/ui/modal";

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
      size="lg"
      showOverlay={true}
      closeOnClickOutside={false}
      showCloseButton={true}
      className="bg-white rounded-lg shadow-xl"
    >
      <ModalBody className="p-8 ">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingBranch ? t("editBranch") : t("createNewBranch")}
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-[#F0F0F0] rounded-xl"
                        placeholder={t("branchName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("phone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-[#F0F0F0] rounded-xl"
                        placeholder={t("phoneNumber")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("location")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-[#F0F0F0] rounded-xl"
                      placeholder={t("address")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-6 py-2"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  form.formState.isSubmitting
                }
                className="px-6 py-2 bg-black hover:bg-gray-800 text-white"
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
