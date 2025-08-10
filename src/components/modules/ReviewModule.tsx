import { TOrderItem } from "@/types";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { uploadImagesAction } from "@/actions/fileActions";
import { createProductReviewsAction, getProductReviewsAction, updateProductReviewsAction } from "@/actions/reviewActions";
import { toast } from 'sonner'

export default function ReviewModule(props: { visible: boolean, orderItem: TOrderItem, onClose: () => void }) {
  const { onClose, orderItem, visible } = props;
  const [rating, setRating] = useState<number>(0);
  const [listImg, setListImg] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdate, setIsUpdate] = useState(false)
  const [comment, setComment] = useState('');
  const [reviewId, setReviewId]= useState<number>()
  useEffect(() => {
    const getReviewById = async () => {
      try {
        if (orderItem?.id) {
          const res = await getProductReviewsAction(orderItem.id);
          if (res.status && res.reviews) {
            setComment(res.reviews.comment || '');
            setReviewId(res.reviews.id)
            setRating(res.reviews.rating || 0);
            setIsUpdate(true)
            setListImg(res.reviews.imageUrls || []);
          }
        }
      } catch (error) {
        console.log("Error");
      }
    };
    if (visible) getReviewById();
  }, [orderItem?.id, visible]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  if (!visible) return null;
  const CloseMoule = () => {
    setRating(0)
    setReviewId(undefined)
    setComment('')
    setListImg([])
    onClose()
  }
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    try {
      const res = await uploadImagesAction(fileArray);
      if (res.success && res.data) {
        const imgRes: string[] = [];
        for (const img of res.data) {
          if (img.imageUrl) {
            imgRes.push(img.imageUrl);
          }
        }
        setListImg((prevList) => [...prevList, ...imgRes]);
        toast.success("Tải hình ảnh thành công");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải hình ảnh");
    }

  };

  const handleSubmit = async () => {
    if (isUpdate && reviewId) {
      try {
        console.log(orderItem.id)
        const res = await updateProductReviewsAction(rating, comment, listImg, reviewId)
        console.log(res)
        if (res.status) {
          CloseMoule()
          toast.success("Chỉnh sửa đánh giá sản phẩm thành công")
        }
      } catch (error: any) {
        console.log(error)
      }
    } else {
      try {
        const res = await createProductReviewsAction(rating, comment, listImg, orderItem.id)
        console.log(res)
        if (res.status) {
          CloseMoule()
          toast.success("Đánh giá sản phẩm thành công")
        }
      } catch (error: any) {
        console.log(error)
      }
    }

  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={CloseMoule}>
      <Card className="relative w-full max-w-3xl bg-white dark:bg-gray-700 !p-6 rounded-lg shadow-lg" onClick={stopPropagation}>
        <CardHeader className="font-bold text-2xl !p-0">Đánh giá sản phẩm</CardHeader>
        <div className="pt-4">
          {/* Product preview */}
          <div className="border border-black dark:border-white p-3 rounded-lg flex">
            <img className="w-24 h-24" src={orderItem.image.imageUrl} alt={String(orderItem.image.id)} />
            <div className="ml-7 h-24 justify-between flex flex-col">
              <p className="text-xl font-bold">{orderItem.productVariant.product.name}</p>
              <span>Màu {orderItem?.productVariant?.color?.name}, Size {orderItem?.productVariant?.size?.name}</span>
              <span>Số lượng: {orderItem?.quantity}</span>
            </div>
          </div>

          <div className="flex mt-5 h-6">
            <p className="h-full items-center">Chất lượng sản phẩm</p>
            <div className="rating ml-3 flex h-full">
              <input type="radio" checked={rating === 5} onChange={() => setRating(5)} id="star5" name="rating" value="5" />
              <label className="ml-3 -mt-3.5" htmlFor="star5"></label>
              <input type="radio" checked={rating === 4} onChange={() => setRating(4)} id="star4" name="rating" value="4" />
              <label className="ml-3 -mt-3.5" htmlFor="star4"></label>
              <input type="radio" checked={rating === 3} onChange={() => setRating(3)} id="star3" name="rating" value="3" />
              <label className="ml-3 -mt-3.5" htmlFor="star3"></label>
              <input type="radio" checked={rating === 2} onChange={() => setRating(2)} id="star2" name="rating" value="2" />
              <label className="ml-3 -mt-3.5" htmlFor="star2"></label>
              <input type="radio" checked={rating === 1} onChange={() => setRating(1)} id="star1" name="rating" value="1" />
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
              <svg width="24" height="25" fill="white" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
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
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="p-2 border border-gray-300 mt-3 rounded-lg w-full" style={{ minHeight: '130px' }} placeholder="Hãy chia sẻ trải nghiệm của bạn với những người mua khác nhé." />

          {/* Image previews */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3\5 md:grid-cols-6 lg:grid-cols-7">
            {listImg.map((img, index) => (
              <div key={index} className="w-full aspect-square overflow-hidden rounded-lg shadow">
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
          <button onClick={CloseMoule} className="px-4 py-1.5 border border-black dark:border-white rounded-lg">Hủy bỏ</button>
          <button onClick={handleSubmit} disabled={!rating || !comment} className={cn("px-4 py-1.5 border border-black bg-black text-white ml-3 rounded-lg", (!rating || !comment) && "cursor-not-allowed")}>{isUpdate ? 'Chỉnh sửa' : 'Hoàn thành'}</button>
        </CardFooter>
      </Card>
    </div>
  );
}
