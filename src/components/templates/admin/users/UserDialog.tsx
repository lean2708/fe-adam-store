"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { createUserAction, updateUserAction, fetchAllRolesAction } from "@/actions/userActions";
import type { UserResponse, RoleResponse } from "@/api-client/models";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  dob: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  roleIds: z.array(z.number()).min(1, "At least one role is required"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  user?: UserResponse | null;
}

export function UserDialog({ open, onClose, user }: UserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dob: "",
      gender: undefined,
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
        dob: user.dob || "",
        gender: user.gender as "MALE" | "FEMALE" | "OTHER" | undefined,
        roleIds: user.roles ? Array.from(user.roles).map((role: any) => role.id) : [],
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        dob: "",
        gender: undefined,
        roleIds: [],
      });
    }
  }, [user, form]);

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const result = await fetchAllRolesAction();
      if (result.success && result.data) {
        setRoles(result.data?.items || []);
      }
    } catch (error) {
      toast.error("Failed to fetch roles");
    } finally {
      setRolesLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        // Update user
        const updateData = {
          name: data.name,
          dob: data.dob || "",
          gender: data.gender || "OTHER",
          roleIds: new Set(data.roleIds),
        };

        const result = await updateUserAction(user.id!, updateData);
        
        if (result.success) {
          toast.success("User updated successfully");
          onClose(true);
        } else {
          toast.error(result.message || "Failed to update user");
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
          toast.success("User created successfully");
          onClose(true);
        } else {
          toast.error(result.message || "Failed to create user");
        }
      }
    } catch (error) {
      toast.error(isEditing ? "Failed to update user" : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update user information and roles." 
              : "Create a new user account with roles."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user name" {...field} />
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
                      placeholder="Enter email address" 
                      disabled={isEditing}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
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
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleIds"
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className="space-y-2">
                    {rolesLoading ? (
                      <div className="text-sm text-muted-foreground">Loading roles...</div>
                    ) : (
                      roles.map((role) => (
                        <FormField
                          key={role.id}
                          control={form.control}
                          name="roleIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={role.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role.id!)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, role.id!])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== role.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {role.name}
                                  {role.description && (
                                    <span className="text-muted-foreground text-xs block">
                                      {role.description}
                                    </span>
                                  )}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
