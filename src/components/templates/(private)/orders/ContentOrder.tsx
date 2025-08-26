"use client";

import {
  getAllOrderUserAction,
  retryPaymentviaVnPayAction,
} from "@/actions/orderActions";
import { TAddressItem, TOrder, TOrderItem } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ChooseAddress from "@/components/modules/ChooseAddress";
import OrderItem from "@/components/ui/order-item";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { checkReviewAction } from "@/actions/reviewActions";
import { toast } from "sonner";

type TabStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
interface TabItem {
  key: TabStatus;
  label: string;
}
const tabList: TabItem[] = [
  { key: "PENDING", label: "Đơn hàng chờ xác nhận" },
  { key: "PROCESSING", label: "Đơn hàng đang xử lý" },
  { key: "SHIPPED", label: "Đơn hàng đã gửi đi" },
  { key: "DELIVERED", label: "Đơn hàng đã giao" },
  { key: "CANCELLED", label: "Đơn hàng đã huỷ" },
];
export function ContentOrder() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, isLoading, router]);

  const [state, setState] = useState<{
    isVisible: boolean;
    isLoading: boolean;
    itemOnModule: TOrder | undefined;
    activeStatus: TabStatus;
    listOrders: TOrder[];
  }>({
    isVisible: false,
    isLoading: true,
    itemOnModule: undefined,
    activeStatus: "PENDING",
    listOrders: [],
  });
  useEffect(() => {
    getData();
  }, [state.activeStatus]);

  useEffect(() => {
    if (state.activeStatus === "DELIVERED") {
      checkAllProductReview();
    }
  }, [state.activeStatus, state.listOrders]);

  const getData = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const res = await getAllOrderUserAction(state.activeStatus);
      if (res.success) {
        // Transform OrderResponse[] to TOrder[] to match expected structure

        setState((prevState) => ({
          ...prevState,
          listOrders: res.data || [],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  const checkAllProductReview = async () => {
    if (state.listOrders.length === 0) {
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));
    const arrayMap: TOrder[] = state.listOrders;
    for (let i = 0; i < arrayMap.length; i++) {
      for (let y = 0; y < arrayMap[i].orderItems.length; y++) {
        const res = await checkReview(arrayMap[i].orderItems[y].id);
        arrayMap[i].orderItems[y].isReview = res;
      }
    }
    setState((prevState) => ({
      ...prevState,
      listOrders: arrayMap,
      isLoading: false,
    }));
  };
  const checkReview = async (id: number) => {
    try {
      const res = await checkReviewAction(id);
      if (res.status && res.review) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  };

  const setNewListOrderAfterReview = (idProduct: number, idOrder: number) => {
    const arrayMap: TOrder[] = state.listOrders;
    arrayMap[idOrder].orderItems[idProduct].isReview = true;
    setState((prevState) => ({
      ...prevState,
      listOrders: arrayMap,
    }));
  };

  const handleRetryPayment = async (orderId: number) => {
    try {
      const res = await retryPaymentviaVnPayAction(orderId);

      if (res.success && res.data?.paymentUrl) {
        router.push(res.data.paymentUrl);
      } else {
        toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Failed to retry payment:", error);
      toast.error("Có lỗi xảy ra khi tạo liên kết thanh toán.");
    }
  };

  return (
    <>
      <div className="rounded-xl border-2 border-black dark:border-white">
        <div className="flex border-b border-black dark:border-white !box-border overflow-auto pt-2">
          {tabList.map((tab) => (
            <button
              key={tab.key}
              className={cn(
                "outline-none whitespace-nowrap mx-4 h-full dark:text-white text-black py-2 text-sm font-medium transition-colors",
                state.activeStatus === tab.key &&
                  "border-b-3 border-black dark:border-white"
              )}
              onClick={() => {
                if (state.activeStatus !== tab.key) {
                  setState((pv) => ({
                    ...pv,
                    listOrders: [],
                    activeStatus: tab.key,
                  }));
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="px-8 py-6">
          <div className="rounded-xl px-5">
            <div>
              {state.isLoading && (
                <div>
                  <h3 className="border-b-1 h-11 flex items-center justify-end border-gray-400 border-dashed font-semibold uppercase">
                    {
                      tabList.find((tab) => tab.key === state.activeStatus)
                        ?.label
                    }
                  </h3>
                  <div className="py-3 flex w-full justify-between h-24 items-center">
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              )}
              {!state.isLoading && state.listOrders.length === 0 && (
                <div>
                  <h3 className="border-b-1 h-11 flex items-center justify-end border-gray-400 border-dashed font-semibold uppercase">
                    {
                      tabList.find((tab) => tab.key === state.activeStatus)
                        ?.label
                    }
                  </h3>
                  <div className="py-3 flex w-full justify-between h-24 items-center">
                    <p className="bg-gray-100 rounded-md py-3 flex w-full h-16 items-center justify-center">
                      Bạn chưa có đơn hàng nào cả
                    </p>
                  </div>
                </div>
              )}
              {!state.isLoading &&
                state.listOrders.length > 0 &&
                state.listOrders.map((item: TOrder, index: number) => {
                  return (
                    <div
                      key={item.id}
                      className={cn("rounded-md mb-2 bg-gray-100 px-5")}
                    >
                      <h3 className="border-b-1 h-11 flex items-center justify-end border-gray-600 border-dashed font-semibold uppercase">
                        {
                          tabList.find((tab) => tab.key === state.activeStatus)
                            ?.label
                        }
                      </h3>

                      <OrderItem
                        onRetryPay={() => handleRetryPayment(+item.id)}
                        onDeleted={(id: number) => {
                          if (id) {
                            const updatedOrders = [...state.listOrders];
                            const foundIndex = updatedOrders.findIndex(
                              (item) => +item.id === id
                            );
                            if (foundIndex !== -1) {
                              updatedOrders.splice(foundIndex, 1);
                              setState((pv) => ({
                                ...pv,
                                listOrders: updatedOrders,
                              }));
                            }
                          }
                        }}
                        id={+item.id}
                        key={item.id}
                        items={item.orderItems as TOrderItem[]}
                        totalPrice={+item.totalPrice}
                        activeStatus={state.activeStatus}
                        openModule={() => {
                          setState((pv) => ({
                            ...pv,
                            isVisible: true,
                            itemOnModule: item,
                          }));
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <ChooseAddress
        visible={state.isVisible}
        orderItem={state.itemOnModule}
        onClose={() => setState((pstate) => ({ ...pstate, isVisible: false }))}
        onSuccess={(address: TAddressItem) => {
          if (state.listOrders.length && address && state.itemOnModule) {
            const foundIndex = state.listOrders.findIndex(
              (item) => item.id === state.itemOnModule?.id
            );
            if (foundIndex !== -1) {
              const updatedOrders = [...state.listOrders];
              // Format address as string to match TOrder type
              const addressString = `${address.streetDetail}, ${address.ward?.name}, ${address.district?.name}, ${address.province?.name}`;
              updatedOrders[foundIndex] = {
                ...updatedOrders[foundIndex],
                address: addressString,
              };
              setState((ps) => ({
                ...ps,
                listOrders: updatedOrders,
                isVisible: false,
                itemOnModule: undefined,
              }));
            }
          }
        }}
      />
    </>
  );
}
