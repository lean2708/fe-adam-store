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
  addColorAction,
  updateColorAction
} from "@/actions/colorActions";
import { colorSchema, type ColorFormData } from "@/actions/schema/colorSchema";
import type { TColor } from "@/types";

interface ColorDialogProps {
  open: boolean;
  onClose: () => void;
  editingColor: TColor | null;
}

export function ColorDialog({ open, onClose, editingColor }: ColorDialogProps) {
  const t = useTranslations("Admin.colors");
  const queryClient = useQueryClient();
  
  const form = useForm<ColorFormData>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: ""
    }
  });

  // Update form data when editingColor changes
  useEffect(() => {
    if (editingColor) {
      form.reset({
        name: editingColor.name || ""
      });
    } else {
      form.reset({
        name: ""
      });
    }
  }, [editingColor, form]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await addColorAction(formData);
      if (!result.success) {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof ColorFormData, {
                type: "server",
                message: messages[0]
              });
            }
          });
        }
        throw new Error(result.message || "Failed to create color");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Color created successfully");
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateColorAction(id, formData);
      if (!result.success) {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof ColorFormData, {
                type: "server",
                message: messages[0]
              });
            }
          });
        }
        throw new Error(result.message || "Failed to update color");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Color updated successfully");
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (values: ColorFormData) => {
    const formDataObj = new FormData();
    formDataObj.append("name", values.name);

    if (editingColor) {
      updateMutation.mutate({ id: editingColor.id.toString(), formData: formDataObj });
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
            {editingColor ? t("editColor") : t("createNewColor")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingColor 
              ? t("updateColorInfo")
              : t("addNewColor")
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
                          placeholder={t("colorName")}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-1">
                        {t("colorPreviewNote")}
                      </p>
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
                {editingColor ? t("update") : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
