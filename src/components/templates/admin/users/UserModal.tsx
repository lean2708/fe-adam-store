"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalBody } from "@/components/ui/modal";

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
  userFormSchema,
  type UserFormData
} from "@/actions/schema/userSchema";
import type { TUser, TRole, TEntityBasic } from "@/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";



interface UserModalProps {
  open: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  user?: TUser | null;
}

export function UserModal({ open, onClose, user }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<TRole[]>([]);
  const t = useTranslations("Admin.users");


  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dob: "",
      confirmPassword: "",
      roleIds: [],
      gender: undefined,
      isEditing: false,
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
        dob: user.dob || "",
        gender: user.gender || undefined,
        isEditing: true,
      });
      // setShowPasswordFields(false); // Hide password fields by default for editing
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleIds: [],
        dob: "",
        gender: undefined,
        isEditing: false,
      });
      // setShowPasswordFields(false); // Reset password fields visibility
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
        // Update user - pass the form data directly
        const result = await updateUserAction(user.id!, {
          name: data.name,
          email: data.email,
          roleIds: data.roleIds,
          dob: data.dob,
          gender: data.gender,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });

        if (result.success) {
          toast.success("Cập nhật người dùng thành công");
          onClose(true);
        } else {
          toast.error(result.message || "Không thể cập nhật người dùng");
        }
      } else {
        // Create user - pass the form data directly
        const result = await createUserAction({
          name: data.name,
          email: data.email,
          password: data.password!,
          confirmPassword: data.confirmPassword!,
          roleIds: data.roleIds,
          dob: data.dob,
          gender: data.gender,
        });

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
      showCloseButton={true}
      className="bg-white rounded-lg shadow-xl"
    >
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {isEditing
            ? "Cập nhật thông tin người dùng và vai trò."
            : "Tạo tài khoản người dùng mới với vai trò."}
        </p>
      </div>

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
                          <SelectValue placeholder={roles[0]?.name} />
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

            {/* Date of Birth field - only show when editing */}
            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-[#F0F0F0] rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("gender.title")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#F0F0F0] rounded-xl">
                            <SelectValue placeholder={t("gender.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">{t("gender.Male")}</SelectItem>
                          <SelectItem value="FEMALE">{t("gender.Female")}</SelectItem>
                          <SelectItem value="OTHER">{t("gender.Other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Password fields */}
            {!isEditing ? (
              // For creating new users - password is required
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mật khẩu <span className="text-red-500">*</span>
                      </FormLabel>
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nhập lại mật khẩu <span className="text-red-500">*</span>
                      </FormLabel>
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
              </>
            ) : (
              // For editing users - password is optional
              <div className="space-y-4">
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Thay đổi mật khẩu</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordFields(!showPasswordFields);
                      if (!showPasswordFields) {
                        // Clear password fields when hiding
                        form.setValue("password", "");
                        form.setValue("confirmPassword", "");
                      }
                    }}
                  >
                    {showPasswordFields ? "Ẩn" : "Hiển thị"}
                  </Button>
                </div>

                {showPasswordFields && (
                  <>
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <strong>Lưu ý:</strong> Để trống các trường mật khẩu nếu không muốn thay đổi mật khẩu hiện tại.
                    </div>

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu mới (tùy chọn)</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Nhập mật khẩu mới"
                              className="bg-[#F0F0F0] rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Nhập lại mật khẩu mới"
                              className="bg-[#F0F0F0] rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )} */}
              </div>
            )}

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
