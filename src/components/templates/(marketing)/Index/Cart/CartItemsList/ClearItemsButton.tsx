'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/(cart)/useCart';
import { Trash2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ClearCartButton({ userId }: { userId: string }) {
  const { handleDeleteAllItems, cartItems } = useCart(userId);
  const [isDeleting, setIsDeleting] = useState(false);

  if (cartItems.length === 0) return null;

  const handleClick = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteAllItems();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className='ml-auto text-muted-foreground font-normal cursor-pointer hover:underline'
    >
      {isDeleting ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <span>Xóa tất cả</span>
      )}
    </button>
  );
}
