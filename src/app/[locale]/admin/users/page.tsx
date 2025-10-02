'use client';

import { useState } from 'react';
import type { TUser } from '@/types';
import { useUsers } from '@/hooks/admin/useUsers';
import dynamic from 'next/dynamic';

const UserTable = dynamic(() =>
  import('@/components/templates/admin/users/UserTable').then((mod) => ({
    default: mod.UserTable,
  }))
);

const UserModal = dynamic(() =>
  import('@/components/templates/admin/users/UserModal').then((mod) => ({
    default: mod.UserModal,
  }))
);

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  const {
    users,
    totalElements,
    totalPages,
    loading,
    handleDelete,
    handleRestore,
    handleRefresh,
  } = useUsers(currentPage, pageSize);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: TUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = (shouldRefresh?: boolean) => {
    setIsModalOpen(false);
    setSelectedUser(null);
    if (shouldRefresh) {
      handleRefresh();
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 rounded-lg border'>
      <div className='admin-page-container space-y-6 mt-4  '>
        <div className='bg-white  shadow-sm  p-4 md:p-6 dark:bg-gray-900'>
          <UserTable
            users={users}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onCreateUser={handleCreateUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDelete}
            onRestoreUser={handleRestore}
            onRefresh={handleRefresh}
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
