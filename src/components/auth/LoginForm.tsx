"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const success = await signIn(email, password);
      
      if (success) {
        toast.success("Đăng nhập thành công!");
        router.push("/"); // Redirect to home or dashboard
      } else {
        toast.error("Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
