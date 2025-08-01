"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data for now - this would come from an orders API
interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  amount: number;
  status: string;
  createdAt: string;
}

const mockOrders: RecentOrder[] = [
  {
    id: "ORD-001",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@example.com",
    amount: 1250000,
    status: "COMPLETED",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@example.com",
    amount: 890000,
    status: "PROGRESS",
    createdAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "ORD-003",
    customerName: "Lê Văn C",
    customerEmail: "levanc@example.com",
    amount: 2100000,
    status: "SENDING",
    createdAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "ORD-004",
    customerName: "Phạm Thị D",
    customerEmail: "phamthid@example.com",
    amount: 750000,
    status: "COMPLETED",
    createdAt: "2024-01-14T16:20:00Z",
  },
  {
    id: "ORD-005",
    customerName: "Hoàng Văn E",
    customerEmail: "hoangvane@example.com",
    amount: 1680000,
    status: "PROGRESS",
    createdAt: "2024-01-14T14:10:00Z",
  },
];

export function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'SENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'CANCELED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'PROGRESS':
        return 'In Progress';
      case 'SENDING':
        return 'Sending';
      case 'CANCELED':
        return 'Canceled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-32" />
            </div>
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center space-x-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={order.customerAvatar} alt={order.customerName} />
            <AvatarFallback>
              {order.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium leading-none">
                  {order.customerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.customerEmail}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatCurrency(order.amount)}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t">
        <Link 
          href="/admin/orders" 
          className="text-sm text-primary hover:underline"
        >
          View all orders →
        </Link>
      </div>
    </div>
  );
}
