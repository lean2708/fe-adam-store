"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Edit, Trash2, RotateCcw } from "lucide-react";
import { fetchAllUsersAction, deleteUserAction, restoreUserAction } from "@/actions/userActions";
import type { UserResponse } from "@/api-client/models";
import { toast } from "sonner";
import { UserDialog } from "@/components/templates/admin/users/UserDialog";

export default function UsersPage() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const pageSize = 10;

  const fetchUsers = async (page: number = 0) => {
    setLoading(true);
    try {
      const result = await fetchAllUsersAction(page, pageSize);

      if (result.success && result.data) {
        setUsers(result.data.items || []);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalItems || 0);
        setCurrentPage(page);
      } else {
        toast.error(result.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const result = await deleteUserAction(id);

      if (result.success) {
        toast.success("User deleted successfully");
        fetchUsers(currentPage);
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleRestoreUser = async (id: number) => {
    try {
      const result = await restoreUserAction(id);

      if (result.success) {
        toast.success("User restored successfully");
        fetchUsers(currentPage);
      } else {
        toast.error(result.message || "Failed to restore user");
      }
    } catch (error) {
      toast.error("Failed to restore user");
    }
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh?: boolean) => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    if (shouldRefresh) {
      fetchUsers(currentPage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
          <p className="text-muted-foreground">
            {t('users.description')}
          </p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          {t('users.addUser')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="admin-table-container">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Sinh nhật</TableHead>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {/* ID */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-16" /></TableCell>
                        {/* Tên */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-32" /></TableCell>
                        {/* Email */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-40" /></TableCell>
                        {/* Giới tính */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-16" /></TableCell>
                        {/* Sinh nhật */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-24" /></TableCell>
                        {/* Avatar */}
                        <TableCell><div className="w-8 h-8 bg-muted rounded-full animate-pulse" /></TableCell>
                        {/* Vai trò */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-20" /></TableCell>
                        {/* Trạng thái */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-20" /></TableCell>
                        {/* Hành động */}
                        <TableCell><div className="h-4 bg-muted rounded animate-pulse w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        {/* ID */}
                        <TableCell className="font-mono text-sm">
                          {user.id}
                        </TableCell>

                        {/* Tên */}
                        <TableCell>
                          <div className="font-medium">{user.name || 'N/A'}</div>
                        </TableCell>

                        {/* Email */}
                        <TableCell className="text-sm">
                          {user.email}
                        </TableCell>

                        {/* Giới tính */}
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : user.gender === 'OTHER' ? 'Khác' : '-'}
                          </Badge>
                        </TableCell>

                        {/* Sinh nhật */}
                        <TableCell className="text-sm">
                          {user.dob ? formatDate(user.dob, locale, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                        </TableCell>

                        {/* Avatar */}
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>

                        {/* Vai trò */}
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles && Array.from(user.roles).map((role) => (
                              <Badge key={role.id} variant="secondary" className="text-xs">
                                {role.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        {/* Trạng thái */}
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${getStatusColor(user.status || 'ACTIVE')}`}
                          >
                            {user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'INACTIVE' ? 'Không hoạt động' : user.status || 'Hoạt động'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'ACTIVE' ? (
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user.id!)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleRestoreUser(user.id!)}>
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Restore
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Dialog */}
      <UserDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        user={selectedUser}
      />
    </div>
  );
}
