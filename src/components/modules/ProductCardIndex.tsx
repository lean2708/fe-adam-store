import Image from "next/image";
import { TProduct } from "@/types";

interface ProductCardIndexProps {
  product: TProduct;
  badgeText?: string;
  className?: string;
}

export default function ProductCardIndex({
  product,
  badgeText = "Mới",
  className = ""
}: ProductCardIndexProps) {
  return (
    <div className={`group cursor-pointer relative ${className}`}>
      {/* Product Image */}
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
        <Image
          src={product.mainImage || "https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300"}
          alt={product.name || "Product image"}
          width={300}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
            {badgeText}
          </span>
        </div>

        {/* Hover Bottom Panel */}
        <div className="absolute bottom-0 left-2 right-2 bg-white/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 transform translate-y-full group-hover:-translate-y-2 transition-transform duration-300 ease-out rounded-lg border border-gray-200 shadow-lg">
          {/* Add to Cart Button */}
          <button className="w-full bg-black text-white py-2 sm:py-2.5 md:py-3 rounded-lg font-medium text-xs sm:text-sm mb-2 sm:mb-3 hover:bg-gray-800 transition-colors shadow-sm border border-black/10">
            Thêm vào giỏ hàng +
          </button>

          {/* Size Options */}
          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
            <span className="px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200 hover:border-gray-300 shadow-sm">M</span>
            <span className="px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200 hover:border-gray-300 shadow-sm">L</span>
            <span className="px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200 hover:border-gray-300 shadow-sm">XL</span>
            <span className="px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 text-gray-400 rounded-full line-through cursor-not-allowed border border-gray-200 opacity-60">2XL</span>
            <span className="px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 text-gray-400 rounded-full line-through cursor-not-allowed border border-gray-200 opacity-60">3XL</span>
          </div>
        </div>
      </div>

      {/* Color dots */}
      <div className="flex items-center gap-2 mb-3">
        {product.colors?.slice(0, 2).map((color) => (
          <span
            key={color.id}
            className="inline-block border border-gray-300"
            style={{
              width: '50px',
              height: '29px',
              borderRadius: '100px',
              opacity: 1,
              backgroundColor: color.name === "Black" ? "#000000" :
                             color.name === "White" ? "#ffffff" :
                             color.name === "Blue" ? "#1e40af" :
                             color.name === "Beige" ? "#f5f5dc" :
                             color.name === "Brown" ? "#8b4513" :
                             color.name === "Đen" ? "#000000" :
                             color.name === "Trắng" ? "#ffffff" :
                             color.name === "Xanh" ? "#1e40af" :
                             color.name === "Be" ? "#f5f5dc" :
                             color.name === "Nâu" ? "#8b4513" : "#f5f5f5"
            }}
          />
        ))}
      </div>

      {/* Product Title */}
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
        {product.title}
      </h3>

      {/* Price */}
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {product.colors?.[0]?.variants?.[0]?.price?.toLocaleString('vi-VN')} VND
      </p>
    </div>
  );
}
