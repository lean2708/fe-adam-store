import { cn, formatCurrency } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmDialogModule from "../modules/ConfirmDialogModule";
import { cancelOrderAction } from "@/actions/orderActions";
import { TOrderItem } from "@/types";
import { toast } from "sonner";
import ReviewModule from "../modules/ReviewModule";
import { checkReviewAction } from "@/actions/reviewActions";
type TabStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export default function OrderItem(props: {
  onDeleted: (id: number) => void;
  id: number;
  reviewed: (idProduct: number, idOrder: number) => void;
  activeStatus: TabStatus;
  totalPrice?: number;
  items?: TOrderItem[];
  openModule: () => void;
}) {
  const btnByStatus: Record<TabStatus, React.ReactNode> = {
    PENDING: (
      <>
        <button className="w-40 px-4 py-2 mr-4 rounded-md border border-[#C5C4C2] text-sm text-[#C5C4C2] bg-[#E5E4E1]">
          Chờ
        </button>
        <button
          onClick={() => openModule()}
          className="w-52 px-4 mr-4 py-2 rounded-md border border-[#888888] text-sm"
        >
          Thay đổi địa chỉ nhận hàng
        </button>
        <button
          onClick={() => {
            setIsDeleted(true);
          }}
          className="w-40 px-4 py-2 border-[#888888] border text-black rounded-md text-sm"
        >
          Huỷ đơn hàng
        </button>
      </>
    ),
    PROCESSING: (
      <>
        <button className="w-40 px-4 py-2 mr-4 rounded-md border border-[#C5C4C2] text-sm text-[#C5C4C2] bg-[#E5E4E1]">
          Chờ
        </button>
        <button
          onClick={() => openModule()}
          className="w-52 px-4 mr-4 py-2 rounded-md border border-[#888888] text-sm"
        >
          Thay đổi địa chỉ nhận hàng
        </button>
        <button
          onClick={() => {
            setIsDeleted(true);
          }}
          className="w-40 px-4 py-2 border-[#888888] border text-black rounded-md text-sm"
        >
          Huỷ đơn hàng
        </button>
      </>
    ),
    SHIPPED: (
      <>
        <button className="w-56 text-gray-400 px-4 py-2 rounded-md border border-gray-400 text-sm">
          Xác nhận đã nhận hàng
        </button>
      </>
    ),
    DELIVERED: (
      <>
        <button className="w-40 px-4 py-2 border border-[#888888] rounded-md text-sm mr-4">
          Liện hệ chúng tôi
        </button>
        <button className="w-28 px-4 py-2 bg-black text-white rounded-md text-sm">
          Mua lại
        </button>
      </>
    ),
    CANCELLED: (
      <>
        <button className="w-28 px-4 py-2 bg-black text-white rounded-md text-sm">
          Mua lại
        </button>
      </>
    ),
  };
  const {
    onDeleted,
    reviewed,
    id,
    items,
    activeStatus,
    openModule,
    totalPrice,
  } = props;
  const [dropList, setDropList] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!items) return null;
  const CloseOrder = async () => {
    try {
      setLoading(true);
      if (id) {
        const res = await cancelOrderAction(String(id));
        console.log(res);
        if (res.status === 200) {
          setIsDeleted(false);
          onDeleted(id);
          toast.success("Hủy đơn hàng thành công");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ItemProductOrder
        item={items[0]}
        active={activeStatus}
        reviewed={(idProduct: number) => reviewed(idProduct, id)}
      />
      {dropList &&
        items
          .slice(1)
          .map((item: TOrderItem) => (
            <ItemProductOrder
              key={item.id}
              item={item}
              active={activeStatus}
              reviewed={(idProduct: number) => reviewed(idProduct, id)}
            />
          ))}
      {!dropList && items.length > 1 && (
        <button
          onClick={() => setDropList(true)}
          className="outline-none w-full flex justify-center py-2 border-b-1 border-dashed border-gray-400"
        >
          <p>Xem thêm</p>
          <ChevronDown className="ml-3" />
        </button>
      )}
      <div className="w-full text-end pt-2">
        Tổng số tiền ({items.length} sản phẩm) &nbsp;&nbsp;&nbsp;
        <span className="text-xl font-bold">
          {totalPrice && formatCurrency(totalPrice)}
        </span>
      </div>
      <div className="py-2 text-end">{btnByStatus[activeStatus]}</div>
      <ConfirmDialogModule
        loading={loading}
        onClose={() => setIsDeleted(false)}
        title="Bạn có chắc muốn huỷ đơn hàng ?"
        onSubmit={() => {
          CloseOrder();
        }}
        confirm={isDeleted}
      />
    </>
  );
}

function ItemProductOrder(props: {
  item: TOrderItem;
  active: TabStatus;
  reviewed: (idProduct: number) => void;
}) {
  const { item, reviewed, active } = props;
  const [isReview, setIsReview] = useState(false);
  return (
    <div className="border-b-1 border-dashed border-gray-400 py-2 w-full flex justify-between min-h-25 items-center">
      <div className="flex ">
        <img
          className="h-25 rounded-sm"
          src={item.imageUrl}
          alt={"" + item.image?.id}
        />
        <div className="h-full flex flex-col justify-between ml-3">
          <h4 className="font-bold">{item.productVariant?.product?.name}</h4>
          <p className="text-[#888888]">
            Màu sắc: {item.productVariant?.color?.name}
          </p>
          <p className="text-[#888888]">
            Kích cỡ: {item.productVariant?.size?.name}
          </p>
          <p className="text-[#888888]">×{item.quantity}</p>
        </div>
      </div>
      <p
        className={cn(
          active === "DELIVERED" &&
            "h-25 flex flex-col justify-between items-end"
        )}
      >
        <span className="font-bold">
          {formatCurrency(Number(item.unitPrice))}
        </span>
        {active === "DELIVERED" && (
          <button
            onClick={() => setIsReview(true)}
            className="px-4 py-2 bg-black rounded-md text-white"
          >
            {item.isReview ? "Xem đánh giá" : "Đánh giá"}
          </button>
        )}
      </p>
      <ReviewModule
        isReview={item.isReview || false}
        returnRivew={() => {
          reviewed(item.id);
        }}
        visible={isReview}
        orderItem={item}
        onClose={() => setIsReview(false)}
      />
    </div>
  );
}
