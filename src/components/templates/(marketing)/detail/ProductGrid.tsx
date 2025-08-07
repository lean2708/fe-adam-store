import { TProduct } from "@/types";
import ProductCardIndex from "@/components/modules/ProductCardIndex";

interface ProductGridProps {
  products: TProduct[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="col-span-4 text-center">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (!products) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="col-span-4 text-center text-gray-500">
          Không có sản phẩm nào.
        </div>
      </div>
    );
  }

  return (
    products && (
      <div className="grid   md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCardIndex
            key={product.id}
            product={product}
            badgeText="Mới nhất"
          />
        ))}
      </div>
    )
  );
}
