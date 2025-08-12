'use client';

import { ProductItem } from './ProductItem';

const products = [
  {
    name: 'Áo in cotton Care & Share',
    color: 'Trắng',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Áo khoác gió chống nước UrbanShield',
    color: 'Xanh',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Áo polo thể thao CoolTech',
    color: 'Xám',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Quần bo Slim Fit Classic',
    color: 'Trắng',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Quần bo Slim Fit Classic',
    color: 'Trắng',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Quần bo Slim Fit Classic',
    color: 'Trắng',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Quần bo Slim Fit Classic',
    color: 'Trắng',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Quần bo Slim Fit Classic',
    color: 'Trắng',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
  {
    name: 'Quần bo Slim Fit Classic',
    color: 'Trắng',
    size: 'M',
    quantity: 2,
    price: '1,400,000 VND',
    image: '/imgs/demo-img.jpg',
  },
];

export function ProductList() {
  return (
    <div>
      <h3 className='text-2xl font-bold text-primary mb-6'>Sản phẩm</h3>
      <div className='space-y-6 overflow-y-auto h-screen'>
        {products.map((product, index) => (
          <ProductItem key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
