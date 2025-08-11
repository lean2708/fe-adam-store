import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { useState, useMemo } from "react";
import { ProductResponse } from "@/api-client";
import { transformProductResponseToTProduct } from "@/lib/data/transform/product";
import { TProduct } from "@/types";

interface ProductCardIndexProps {
  product: TProduct;
  badgeText?: string;
  className?: string;
}

export default function ProductItme({
  product,
  badgeText = "Mới",
  className = "",
}: ProductCardIndexProps) {
  // Default selected color is the first color's id, or 0
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0]?.id ?? 0
  );

  if (!product) return null;

  // Find the selected color object
  const selectedColorObj = product.colors?.find(
    (color) => color.id === selectedColor
  );

  return (
    <div className={`group cursor-pointer relative ${className}`}>
      {/* Product Image */}
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
        <Image
          src={
            product.mainImage ||
            "https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300"
          }
          alt={product.title || "Product image"}
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
            {selectedColorObj?.variants
              ?.slice()
              .sort((a, b) => {
                const aId = a.size?.id ?? 0;
                const bId = b.size?.id ?? 0;
                return aId - bId;
              })
              .map((variant) => (
                <span
                  key={variant.id}
                  className={cn(
                    "px-2 sm:px-3 py-1 text-xs font-medium rounded-full border border-gray-200 transition-colors shadow-sm",
                    !variant.isAvailable
                      ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed opacity-60"
                      : "bg-gray-100 hover:bg-gray-200 cursor-pointer hover:border-gray-300"
                  )}
                >
                  {variant.size?.name}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Color dots */}
      <div className="flex items-center gap-2 mb-3">
        {product.colors?.map((color) => (
          <span
            key={color.id}
            className={`inline-block border border-gray-300 ${
              selectedColor === color.id ? "ring-2 ring-black" : ""
            }`}
            style={{
              width: "50px",
              height: "29px",
              borderRadius: "100px",
              opacity: 1,
              backgroundColor: color.name,
              cursor: "pointer",
            }}
            onClick={() => setSelectedColor(color.id)}
          />
        ))}
      </div>

      {/* Product Title */}
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
        {product.title}
      </h3>

      {/* Price */}
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {formatCurrency(product.minPrice)} VND
      </p>
    </div>
  );
}
