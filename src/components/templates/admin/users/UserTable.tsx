"use client";

import { useTranslations, useLocale } from "next-intl";
import { formatDate, getStatusColor } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  RotateCcw,
  RefreshCw,
  Users,
} from "lucide-react";
import type { TUser } from "@/types";
import { AdminPagination } from "@/components/ui/pagination";

interface UserTableProps {
  users: TUser[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onCreateUser: () => void;
  onEditUser: (user: TUser) => void;
  onDeleteUser: (id: string) => void;
  onRestoreUser: (id: string) => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function UserTable({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onRefresh,
  onCreateUser,
  onEditUser,
  onDeleteUser,
  onRestoreUser,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: UserTableProps) {
  const t = useTranslations("Admin");
  const locale = useLocale();


  // No client-side filtering needed since we're using server-side search
  const filteredUsers = users;

  return (
    <div className="space-y-4 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("users.title")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{t("users.description")}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.refresh") || "Làm mới"}
          </Button>
          <Button onClick={onCreateUser} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("users.addUser")}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm rounded-lg border-2 focus-within:border-blue-500 overflow-hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t("users.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none rounded-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-900  ">
                  ID
                </TableHead>
                <TableHead className="font-semibold text-gray-900  ">
                  Avatar
                </TableHead>
                <TableHead className="font-semibold text-gray-900  ">
                  Tên
                </TableHead>
                <TableHead className="font-semibold text-gray-900  ">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-900  ">
                  Giới tính
                </TableHead>
                <TableHead className="font-semibold text-gray-900  ">
                  Sinh nhật
                </TableHead>
                <TableHead className="font-semibold text-gray-900  ">
                  Vai trò
                </TableHead>
                <TableHead className="font-semibold text-gray-900  ">
                  Trạng thái
                </TableHead>
                <TableHead className="font-semibold text-gray-900 text-right whitespace-nowrap">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {/* ID */}
                    <TableCell>
                      <div className="h-4 bg-muted rounded animate-pulse w-16" />
                    </TableCell>
                    {/* Avatar */}
                    <TableCell>
                      <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                    </TableCell>
                    {/* Tên */}
                    <TableCell>
                      <div className="h-4 bg-muted rounded animate-pulse w-32" />
                    </TableCell>
                    {/* Email */}
                    <TableCell>
                      <div className="h-4 bg-muted rounded animate-pulse w-40" />
                    </TableCell>
                    {/* Giới tính */}
                    <TableCell>
                      <div className="h-4 bg-muted rounded animate-pulse w-16" />
                    </TableCell>
                    {/* Sinh nhật */}
                    <TableCell>
                      <div className="h-4 bg-muted rounded animate-pulse w-24" />
                    </TableCell>
                    {/* Vai trò */}
                    <TableCell>
                      <div className="h-6 bg-muted rounded animate-pulse w-20" />
                    </TableCell>
                    {/* Trạng thái */}
                    <TableCell>
                      <div className="h-6 bg-muted rounded animate-pulse w-16" />
                    </TableCell>
                    {/* Hành động */}
                    <TableCell className="text-right">
                      <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("users.noUsersFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    {/* ID */}
                    <TableCell className="font-mono text-sm">
                      {user.id}
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

                    {/* Tên */}
                    <TableCell>
                      <div className="font-medium">{user.name || "N/A"}</div>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {user.email || "N/A"}
                      </div>
                    </TableCell>

                    {/* Giới tính */}
                    <TableCell>
                      <div className="text-sm">
                        {t(`users.gender.${user.gender || "Other"}`)}
                      </div>
                    </TableCell>

                    {/* Sinh nhật */}
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {user.dob
                          ? formatDate(user.dob, locale, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </TableCell>

                    {/* Vai trò */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && Array.from(user.roles).length > 0 ? (
                          Array.from(user.roles).map((role: any) => (
                            <Badge
                              key={role.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {role.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">
                            {t("users.noRoles")}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(
                          user.status || "INACTIVE",
                          "general"
                        )}
                      >
                        {t(user.status || "INACTIVE") ||
                          user.status ||
                          "INACTIVE"}
                      </Badge>
                    </TableCell>

                    {/* Hành động */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">
                              {t("users.openMenu")}
                            </span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("common.edit")}
                          </DropdownMenuItem>
                          {user.status === "ACTIVE" ? (
                            <DropdownMenuItem
                              onClick={() => onDeleteUser(user.id + "")}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("common.delete")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onRestoreUser(user.id + "")}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              {t("common.restore")}
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
        <div className="flex justify-end ">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalElements}
            itemsPerPage={pageSize}
            itemName="users"
          />
        </div>
      )}
    </div>
  );
}
