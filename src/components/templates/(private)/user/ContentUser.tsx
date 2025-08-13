"use client";
import Address from "@/components/templates/(private)/user/address";
import ChangePassword from "@/components/templates/(private)/user/changePassword";
import Infomation from "@/components/templates/(private)/user/infomation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const tabList = [
  { key: "Info", label: "Hồ sơ cá nhân" },
  { key: "Change", label: "Đổi mật khẩu" },
  { key: "Address", label: "Địa chỉ" },
];

export function ContentUser() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
 const searchParams = useSearchParams(); // Lấy tham số tìm kiếm
  const tab = searchParams.get('tab'); 

  const [activeStatus, setActiveStatus] = useState<string>("Info"); // Mặc định là 'Info'

  useEffect(() => {
    // Kiểm tra xác thực và điều hướng đến trang đăng nhập nếu chưa xác thực
    if (!isLoading && !isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, isLoading, router]);

  useEffect(() => {
    // Cập nhật activeStatus nếu có query parameter 'tab'
    if (tab && tabList.some((item) => item.key === tab)) {
      setActiveStatus(tab as string);
    }
  }, [tab]);

  const handleTabChange = (newTab: string) => {
    setActiveStatus(newTab);
    router.push(`/user?tab=${newTab}`); // Cập nhật URL với tab mới
  };

  return (
    <>
      <div className="max-w-xs flex flex-col items-center">
        <h3 className="font-bold text-3xl">Thông tin tài khoản</h3>
        <ul className="mt-4">
          {tabList.map((item) => (
            <li
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={cn(
                "px-3 py-2 cursor-pointer",
                activeStatus !== item.key && "text-gray-400"
              )}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex-col ml-6">
        <h3 className="w-full text-center font-bold text-3xl">
          {tabList.find((tab) => tab.key === activeStatus)?.label}
        </h3>
        {activeStatus === "Info" && <Infomation />}
        {activeStatus === "Change" && <ChangePassword />}
        {activeStatus === "Address" && <Address />}
      </div>
    </>
  );
}
