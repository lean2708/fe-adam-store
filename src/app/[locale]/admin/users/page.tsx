"use client";

import { useState, useEffect } from "react";
import { UserTable } from "@/components/templates/admin/users/UserTable";
import { UserModal } from "@/components/templates/admin/users/UserModal";
import {
  fetchAllUsersAction,
  searchUsersAction,
  deleteUserAction,
  restoreUserAction,
} from "@/actions/userActions";
import type { TUser } from "@/types";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  const pageSize = 10;

  const fetchUsers = async (page: number = 0, searchQuery?: string) => {
    setLoading(true);
    try {
      let result;

      if (searchQuery && searchQuery.trim()) {
        
        // Use search API when there's a search term
        const searchCriteria = [
          `name~${searchQuery.trim()}`,   
        ];
        result = await searchUsersAction(page, pageSize, ["id,desc"], searchCriteria);
        console.log("Searching for", result);
      } else {
        // Use regular fetch when no search term
        result = await fetchAllUsersAction(page, pageSize);
      }

      if (result.success && result.data) {
        setUsers(result.data || []);
        setTotalPages(result.actionSizeResponse?.totalPages || 0);
        setTotalElements(result.actionSizeResponse?.totalItems || 0);
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchUsers(newPage, searchTerm);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
    fetchUsers(0, value);
  };

  const handleRefresh = () => {
    fetchUsers(currentPage, searchTerm);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: TUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
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

  const handleModalClose = (shouldRefresh?: boolean) => {
    setIsModalOpen(false);
    setSelectedUser(null);
    // if (shouldRefresh) {
    //   fetchUsers(currentPage);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-page-container space-y-6 mt-4 rounded-lg">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <UserTable
            users={users}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onCreateUser={handleCreateUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onRestoreUser={handleRestoreUser}
            onRefresh={handleRefresh} // Add this line
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>

        <UserModal
          open={isModalOpen}
          onClose={handleModalClose}
          user={selectedUser}
        />
      </div>
    </div>
  );
}
