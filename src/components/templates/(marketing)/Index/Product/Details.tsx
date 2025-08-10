'use client';

import { TProduct } from '@/types';
import Colors from './(Details)/Colors';
import Sizes from './(Details)/Sizes';
import useProductDetails from '@/hooks/(product_details)/useProductDetails';
import ProductInfo from './(Details)/ProductInfo';
import QuantitySelector from './(Details)/QuantitySelector';
import ProductActions from './(Details)/ProductActions';
import ProductDescription from './(Details)/ProductDescription';

export default function Details({ product }: { product: TProduct }) {
  const {
    selectVariant,
    quantity,
    onChangeColor,
    onChangeSize,
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart,
    handleBuyNow,
  } = useProductDetails(product);

  return (
    <div className='space-y-6 w-full'>
      <ProductInfo product={product} selectVariant={selectVariant} />

      <Colors tColors={product.colors || []} onChangeColor={onChangeColor} />
      <Sizes
        tColor={(product.colors ?? [])[0] ?? []}
        onChangeSize={onChangeSize}
      />

      <QuantitySelector
        quantity={quantity}
        onDecrease={decreaseQuantity}
        onIncrease={increaseQuantity}
      />

      <ProductActions onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />

      <ProductDescription />
    </div>
  );
}
