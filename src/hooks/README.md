# Search Params Hooks & Utilities

Bộ hooks và utilities để xử lý search parameters một cách gọn gàng và dễ bảo trì.

## Hooks

### `useSearchParamsConfig()`

Hook chính để lấy các search parameters với validation và giá trị mặc định.

```tsx
import { useSearchParamsConfig } from "@/hooks/useSearchParams";

function MyComponent() {
  const { page, size, sort, categoryId } = useSearchParamsConfig();

  // page: number (mặc định: 1, min: 1)
  // size: number (mặc định: 12, min: 1, max: 50)
  // sort: string (mặc định: "newest")
  // categoryId: string (mặc định: "")
}
```

### `useUpdateSearchParams()`

Hook để cập nhật search parameters và navigate.

```tsx
import { useUpdateSearchParams } from "@/hooks/useSearchParams";

function MyComponent() {
  const { updateParams } = useUpdateSearchParams();

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const handleCategoryChange = (newCategoryId: string) => {
    updateParams({ categoryId: newCategoryId, page: 1 }); // Reset page khi đổi category
  };

  const handleSortChange = (newSort: string) => {
    updateParams({ sort: newSort }, true); // Sử dụng replace để không thêm vào history
  };
}
```

## Utilities

### `createSearchParams(params)`

Tạo search params string từ object.

```tsx
import { createSearchParams } from "@/lib/searchParams";

const params = createSearchParams({
  page: 2,
  size: 20,
  categoryId: "123",
});
// Kết quả: "page=2&size=20&categoryId=123"
```

### `updateSearchParams(currentParams, updates)`

Cập nhật search params hiện tại.

```tsx
import { updateSearchParams } from "@/lib/searchParams";

const newParams = updateSearchParams(searchParams, {
  page: 3,
  sort: "price-asc",
});
```

### `getSearchParamValue(searchParams, key, defaultValue)`

Lấy giá trị string từ search params với giá trị mặc định.

### `getSearchParamNumber(searchParams, key, defaultValue, min?, max?)`

Lấy giá trị number từ search params với validation min/max.

## Ví dụ sử dụng trong component

```tsx
"use client";

import {
  useSearchParamsConfig,
  useUpdateSearchParams,
} from "@/hooks/useSearchParams";

export default function ProductList() {
  const { page, size, sort, categoryId } = useSearchParamsConfig();
  const { updateParams } = useUpdateSearchParams();

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const handleCategoryChange = (newCategoryId: string) => {
    updateParams({ categoryId: newCategoryId, page: 1 });
  };

  return (
    <div>
      <select
        value={categoryId}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {/* options */}
      </select>

      <select
        value={sort}
        onChange={(e) => updateParams({ sort: e.target.value })}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      <button onClick={() => handlePageChange(page + 1)}>Next Page</button>
    </div>
  );
}
```

## Lợi ích

1. **Gọn gàng**: Code ngắn gọn, dễ đọc
2. **Type-safe**: TypeScript support đầy đủ
3. **Validation**: Tự động validate và set giá trị mặc định
4. **Reusable**: Có thể sử dụng ở nhiều component
5. **Maintainable**: Dễ bảo trì và mở rộng
6. **Performance**: Sử dụng useMemo và useCallback để tối ưu
