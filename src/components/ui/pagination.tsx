import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<typeof Link>;

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'default' : 'secondary',
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className='hidden sm:block'>Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className='hidden sm:block'>Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className='size-4' />
      <span className='sr-only'>More pages</span>
    </span>
  );
}

// Button-based pagination components for admin pages
type PaginationButtonProps = {
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  Omit<React.ComponentProps<typeof Button>, 'onClick' | 'disabled'>;

function PaginationButton({
  className,
  isActive,
  size = 'icon',
  onClick,
  disabled,
  children,
  ...props
}: PaginationButtonProps) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  );
}

function PaginationButtonPrevious({
  className,
  onClick,
  disabled,
  ...props
}: Omit<PaginationButtonProps, 'isActive'>) {
  return (
    <PaginationButton
      size='default'
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className='hidden sm:block'>Previous</span>
    </PaginationButton>
  );
}

function PaginationButtonNext({
  className,
  onClick,
  disabled,
  ...props
}: Omit<PaginationButtonProps, 'isActive'>) {
  return (
    <PaginationButton
      size='default'
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className='hidden sm:block'>Next</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationButton>
  );
}

// Complete admin pagination component with ellipsis logic
interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
}

function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 20,
  itemName = 'items'
}: AdminPaginationProps) {
  // Generate page numbers with ellipsis logic
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // Calculate the range around current page
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);

      // Adjust range if we're near the beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 2, 3);
      } else if (currentPage >= totalPages - 3) {
        startPage = Math.max(1, totalPages - 4);
      }

      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pages.push('ellipsis');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page (if it's not already included)
      if (totalPages > 1) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-end items-center mt-2">
      {/* {showInfo && (
        <div className="text-sm text-muted-foreground">
          Showing {currentPage * itemsPerPage + 1} to{' '}
          {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of{' '}
          {totalItems} {itemName}
        </div>
      )} */}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {/* <PaginationButtonPrevious
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            /> */}
          </PaginationItem>

          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationButton
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                >
                  {page + 1}
                </PaginationButton>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            {/* <PaginationButtonNext
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            /> */}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationButton,
  PaginationButtonPrevious,
  PaginationButtonNext,
  AdminPagination,
};
