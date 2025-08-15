"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createUserAction,
  updateUserAction,
  fetchAllRolesAction,
} from "@/actions/userActions";
import {
  UserUpdateRequestGenderEnum,
  UserUpdateRequest,
} from "@/api-client/models";
import type { TUser, TRole, TEntityBasic } from "@/types";
import { toast } from "sonner";

const userSchema = z
  .object({
    name: z.string().min(1, "Tên người dùng là bắt buộc"),
    email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional(),
    confirmPassword: z.string().optional(),
    roleIds: z.array(z.number()).min(1, "Ít nhất một vai trò là bắt buộc"),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    }
  );

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  open: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  user?: TUser | null;
}

export function UserModal({ open, onClose, user }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<TRole[]>([]);

  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleIds: [],
    },
  });

  // Fetch roles when dialog opens
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't populate password for editing
        confirmPassword: "",
        roleIds: user.roles
          ? Array.from(user.roles).map((role: TEntityBasic) => role.id)
          : [],
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleIds: [],
      });
    }
  }, [user, form]);

  const fetchRoles = async () => {
    try {
      const result = await fetchAllRolesAction();
      if (result.success && result.data) {
        setRoles(result.data?.items || []);
      }
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const onSubmit = async (data: UserFormData) => {
    console.log("Form data:", data);
    setLoading(true);
    try {
      if (isEditing) {
        // Update user
        const updateData: UserUpdateRequest = {
          name: data.name,
          roleIds: new Set(data.roleIds),
          dob: "2025-08-04",
          gender: UserUpdateRequestGenderEnum.Female,
        };

        const result = await updateUserAction(user.id!, updateData);

        if (result.success) {
          toast.success("Cập nhật người dùng thành công");
          onClose(true);
        } else {
          toast.error(result.message || "Không thể cập nhật người dùng");
        }
      } else {
        // Create user
        const createData = {
          name: data.name,
          email: data.email,
          password: data.password!,
          roleIds: new Set(data.roleIds),
        };

        const result = await createUserAction(createData);

        if (result.success) {
          toast.success("Tạo người dùng thành công");
          onClose(true);
        } else {
          toast.error(result.message || "Không thể tạo người dùng");
        }
      }
    } catch (error) {
      toast.error(
        isEditing ? "Không thể cập nhật người dùng" : "Không thể tạo người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="centered"
      size="xl"
      showOverlay={true}
      closeOnClickOutside={false}
      className="bg-white rounded-lg shadow-xl"
    >
      <ModalHeader className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing
              ? "Cập nhật thông tin người dùng và vai trò."
              : "Tạo tài khoản người dùng mới với vai trò."}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClose()}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </ModalHeader>

      <ModalBody className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* First row: Name, Email, Role */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người dùng</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#F0F0F0] rounded-xl"
                        placeholder="Nhập tên người dùng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="bg-[#F0F0F0] rounded-xl"
                        placeholder="Nhập email"
                        disabled={isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange([parseInt(value)])
                      }
                      defaultValue={field.value?.[0]?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#F0F0F0] rounded-xl">
                          <SelectValue placeholder="Quản lý" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id!.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password field - full width */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#F0F0F0] rounded-xl"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password field - full width */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#F0F0F0] rounded-xl"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                className="px-6 py-2"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-black text-white hover:bg-gray-800"
              >
                {loading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Xác nhận"}
              </Button>
            </div>
          </form>
        </Form>
      </ModalBody>
    </Modal>
  );
}
