"use client";

import { useEffect, useState } from "react";
import ProductCardIndex from "@/components/modules/ProductCardIndex";
import { TProduct } from "@/types";
import { getAllProductsAction } from "@/actions/productActions";

export default function NewProducts() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy 8 sản phẩm mới nhất, sắp xếp theo ngày tạo giảm dần
        const response = await getAllProductsAction(0, 8, ["createdAt,desc"]);
        if (response.status === 200 && response.products) {
          setProducts(response.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="animate-pulse bg-gray-100 h-72 rounded" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Không có sản phẩm mới nào.
      </div>
    );
  }

  return (
    <div className="grid  md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {products.map((product) => (
        <ProductCardIndex
          key={product.id}
          product={product}
          badgeText="Mới nhất"
        />
      ))}
    </div>
  );
}
