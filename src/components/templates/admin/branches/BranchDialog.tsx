"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface BranchDialogProps {
  open: boolean;
  onClose: () => void;
  editingBranch: TBranch | null;
}

export function BranchDialog({ open, onClose, editingBranch }: BranchDialogProps) {
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="bg-gray-50 -m-6 mb-0 p-6 rounded-t-lg border-b">
          <DialogTitle className="text-gray-900">
            {editingBranch ? t("editBranch") : t("createNewBranch")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingBranch
              ? t("updateBranchInfo")
              : t("addNewBranch")
            }
          </DialogDescription>
        </DialogHeader>
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
            <DialogFooter className="bg-gray-50 -m-6 mt-0 p-6 rounded-b-lg border-t">
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
