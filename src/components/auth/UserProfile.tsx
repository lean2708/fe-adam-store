"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function UserProfile() {
  const { user, isAuthenticated, logout, isAdmin, hasRole } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Bạn chưa đăng nhập</p>
        </CardContent>
      </Card>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin người dùng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
        
        {user.roles && user.roles.length > 0 && (
          <div>
            <p><strong>Vai trò:</strong></p>
            <div className="flex gap-2 mt-2">
              {user.roles.map((role, index) => (
                <Badge key={index} variant="secondary">
                  {role.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          {isAdmin && (
            <Badge variant="destructive">Admin</Badge>
          )}
          <Badge variant="outline">
            {isAuthenticated ? "Đã đăng nhập" : "Chưa đăng nhập"}
          </Badge>
        </div>
        
        <Button onClick={handleLogout} variant="outline">
          Đăng xuất
        </Button>
      </CardContent>
    </Card>
  );
}
