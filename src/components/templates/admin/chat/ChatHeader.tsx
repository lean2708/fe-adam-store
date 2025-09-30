'use client';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Search, Wifi, WifiOff, MessageCircle } from 'lucide-react';

interface ChatHeaderProps {
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isWebSocketConnected: boolean;
  conversationsCount: number;
  loading?: boolean;
  onCreateConversation?: () => void;
}

export function ChatHeader({
  onRefresh,
  searchTerm,
  onSearchChange,
  isWebSocketConnected,
  conversationsCount,
  loading = false,
  onCreateConversation,
}: ChatHeaderProps) {
  const t = useTranslations('Admin.chat');

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Search is handled by the parent component through onSearchChange
    }
  };

  return (
    <div className='space-y-4 dark:bg-gray-900'>
      {/* Title and Actions */}
      <div className='flex items-center justify-between '>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {t('title') || 'Quản lý Chat'}
          </h1>
          <p className='text-gray-600 mt-1'>
            {t('description') ||
              'Quản lý cuộc trò chuyện và tin nhắn với khách hàng'}
          </p>
        </div>
      </div>

      {/* Search and Status */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='relative flex-1 md:max-w-sm rounded-lg border-2 focus-within:border-blue-500 overflow-hidden'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder={
              t('searchPlaceholder') || 'Tìm kiếm cuộc trò chuyện...'
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className='pl-10 rounded-lg w-full'
          />
        </div>

        <div className='flex items-center gap-3'>
          {/* Connection Status */}
          <Badge
            variant={isWebSocketConnected ? 'default' : 'secondary'}
            className={
              isWebSocketConnected
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }
          >
            {isWebSocketConnected ? (
              <>
                <Wifi className='h-3 w-3 mr-1' />
                {t('connected') || 'Đã kết nối'}
              </>
            ) : (
              <>
                <WifiOff className='h-3 w-3 mr-1' />
                {t('disconnected') || 'Mất kết nối'}
              </>
            )}
          </Badge>

          {/* Conversations Count */}
          <Badge variant='outline' className='bg-white  dark:bg-black'>
            <MessageCircle className='h-3 w-3 mr-1' />
            {conversationsCount} {t('conversations') || 'cuộc trò chuyện'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
