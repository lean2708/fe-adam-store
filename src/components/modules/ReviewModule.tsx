import { TOrderItem } from "@/types";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { uploadImagesAction } from "@/actions/fileActions";
import {
  createProductReviewsAction,
  getProductReviewsAction,
  updateProductReviewsAction,
} from "@/actions/reviewActions";
import { toast } from "sonner";

export default function ReviewModule(props: {
  visible: boolean;
  returnRivew: () => void;
  orderItem: TOrderItem;
  onClose: () => void;
  isReview?: boolean;
}) {
  const { onClose, isReview, orderItem, visible, returnRivew } = props;
  const [state, setState] = useState<{
    loading: boolean;
    rating: number;
    listImg: string[];
    isUpdate: boolean;
    comment: string;
    reviewId: number | undefined;
  }>({
    loading: false,
    rating: 0,
    listImg: [],
    isUpdate: false,
    comment: "",
    reviewId: undefined,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const getReviewById = async () => {
      try {
        setState((ps) => ({ ...ps, loading: true }));
        if (orderItem?.id) {
          const res = await getProductReviewsAction(orderItem.id);
          if (res.status && res.reviews) {
            setState((ps) => ({
              ...ps,
              comment: res.reviews.comment || "",
              reviewId: res.reviews.id || 0,
              rating: res.reviews.rating || 0,
              isUpdate: true,
              listImg: (res.reviews.imageUrls as string[]) || [],
              loading: false,
            }));
          }
        }
      } catch (error) {
        console.log("Error");
      } finally {
        setState((ps) => ({ ...ps, loading: false }));
      }
    };
    if (visible && isReview) getReviewById();
  }, [orderItem?.id, visible]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  if (!visible) return null;
  const CloseMoule = () => {
    setState((ps) => ({
      ...ps,
      rating: 0,
      reviewId: undefined,
      comment: "",
      listImg: [],
    }));

    onClose();
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    try {
      const res = await uploadImagesAction(fileArray);
      console.log(res);
      if (res.success && res.data) {
        const imgRes: string[] = [];
        for (const img of res.data) {
          if (img.imageUrl) {
            imgRes.push(img.imageUrl);
          }
        }
        setState((ps) => ({ ...ps, listImg: [...state.listImg, ...imgRes] }));
        toast.success("Tải hình ảnh thành công");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải hình ảnh");
    }
  };

  const handleSubmit = async () => {
    if (!state.rating || !state.comment) return;

    setState((ps) => ({ ...ps, loading: true }));

    try {
      const reviewData = {
        rating: state.rating,
        comment: state.comment,
        imageUrls: state.listImg,
        orderItemId: orderItem.id,
      };


      CloseMoule();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setState((ps) => ({ ...ps, loading: false }));
    }
  };
  if (!visible) return null;
  if (visible && state.loading)
    return (
      <>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={CloseMoule}
        >
          <Card
            className="relative w-full text-center max-w-3xl bg-white dark:bg-gray-700 !p-6 rounded-lg shadow-lg"
            onClick={stopPropagation}
          >
            Loading . . .
          </Card>
        </div>
      </>
    );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={CloseMoule}
    >
      <Card
        className="relative w-full max-w-3xl bg-white dark:bg-gray-700 !p-6 rounded-lg shadow-lg"
        onClick={stopPropagation}
      >
        <CardHeader className="font-bold text-2xl !p-0">
          Đánh giá sản phẩm
        </CardHeader>
        <div className="pt-4">
          {/* Product preview */}
          <div className="border border-black dark:border-white p-3 rounded-lg flex">
            <img
              className="w-24 h-24"
              src={orderItem?.imageUrl}
              alt={String(orderItem.id)}
            />
            <div className="ml-7 h-24 justify-between flex flex-col">
              <p className="text-xl font-bold">{orderItem.Product?.title}</p>
              <span>
                Màu {orderItem?.productVariant?.color?.name}, Size{" "}
                {orderItem?.productVariant?.size?.name}
              </span>
              <span>Số lượng: {orderItem?.quantity}</span>
            </div>
          </div>

          <div className="flex mt-5 h-6">
            <p className="h-full items-center">Chất lượng sản phẩm</p>
            <div className="rating ml-3 flex h-full">
              <input
                type="radio"
                checked={state.rating === 5}
                onChange={() => setState((ps) => ({ ...ps, rating: 5 }))}
                id="star5"
                name="rating"
                value="5"
              />
              <label className="ml-3 -mt-3.5" htmlFor="star5"></label>
              <input
                type="radio"
                checked={state.rating === 4}
                onChange={() => setState((ps) => ({ ...ps, rating: 4 }))}
                id="star4"
                name="rating"
                value="4"
              />
              <label className="ml-3 -mt-3.5" htmlFor="star4"></label>
              <input
                type="radio"
                checked={state.rating === 3}
                onChange={() => setState((ps) => ({ ...ps, rating: 3 }))}
                id="star3"
                name="rating"
                value="3"
              />
              <label className="ml-3 -mt-3.5" htmlFor="star3"></label>
              <input
                type="radio"
                checked={state.rating === 2}
                onChange={() => setState((ps) => ({ ...ps, rating: 2 }))}
                id="star2"
                name="rating"
                value="2"
              />
              <label className="ml-3 -mt-3.5" htmlFor="star2"></label>
              <input
                type="radio"
                checked={state.rating === 1}
                onChange={() => setState((ps) => ({ ...ps, rating: 1 }))}
                id="star1"
                name="rating"
                value="1"
              />
              <label className="ml-3 -mt-3.5" htmlFor="star1"></label>
            </div>
          </div>

          {/* Add image button */}
          <div className="flex w-full justify-between h-auto items-center pt-4">
            <p>Nội dung đánh giá</p>
            <button
              className="px-6 bg-black text-white py-1.5 rounded-lg flex items-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                width="24"
                height="25"
                fill="white"
                viewBox="0 0 24 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 21.2256C4.45 21.2256 3.97917 21.0298 3.5875 20.6381C3.19583 20.2464 3 19.7756 3 19.2256V5.22559C3 4.67559 3.19583 4.20475 3.5875 3.81309C3.97917 3.42142 4.45 3.22559 5 3.22559H13V5.22559H5V19.2256H19V12.2256H21V19.2256C21 19.7756 20.8042 20.2464 20.4125 20.6381C20.0208 21.0298 19.55 21.2256 19 21.2256H5ZM6 17.2256H18L14.25 12.2256L11.25 16.2256L9 13.2256L6 17.2256ZM18 10.2256V6.05059L16.4 7.62559L15 6.22559L19 2.22559L23 6.22559L21.6 7.62559L20 6.05059V10.2256H18Z" />
              </svg>
              <span className="ml-2">Thêm hình ảnh</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Textarea */}
          <textarea
            value={state.comment}
            onChange={(e) =>
              setState((ps) => ({ ...ps, comment: e.target.value }))
            }
            className="p-2 border border-gray-300 mt-3 rounded-lg w-full"
            style={{ minHeight: "130px" }}
            placeholder="Hãy chia sẻ trải nghiệm của bạn với những người mua khác nhé."
          />

          {/* Image previews */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3\5 md:grid-cols-6 lg:grid-cols-7">
            {state.listImg.map((img, index) => (
              <div
                key={index}
                className="w-full aspect-square overflow-hidden rounded-lg shadow"
              >
                <img
                  src={img}
                  alt={`img-${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="!p-0 w-full flex justify-end !pt-4">
          <button
            onClick={CloseMoule}
            className="px-4 py-1.5 border border-black dark:border-white rounded-lg"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!state.rating || !state.comment}
            className={cn(
              "px-4 py-1.5 border border-black bg-black text-white ml-3 rounded-lg",
              (!state.rating || !state.comment) && "cursor-not-allowed"
            )}
          >
            {state.isUpdate ? "Chỉnh sửa" : "Hoàn thành"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
