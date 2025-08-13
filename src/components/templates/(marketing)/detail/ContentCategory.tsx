"use client";
import { getProductByCategoryAction } from "@/actions/categoryActions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ContentCategory() {
  const searchParams = useSearchParams();
  const paramCate = searchParams.get("category");
  const [sort, setSort] = useState<{ value: string; page: number }>({
    value: "desc",
    page: 1,
  });
  useEffect(() => {
    const getProductByIdCategory = async (id: string) => {
      try {
        const res = await getProductByCategoryAction(id, sort.page, 12, [
        ]);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(paramCate)
    if (paramCate) getProductByIdCategory(paramCate);
  }, [paramCate]);
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort((ps) => ({ ...ps, value: event.target.value }));
  };
  return (
    <>
      <div className="w-full h-20 flex items-center justify-end">
        <p>
          <span className="text-[#888888]">Sắp xếp theo</span>
          <select
            className="outline-none"
            value={sort.value}
            onChange={handleSortChange}
            name="sort"
            id="sort"
          >
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </p>
      </div>
      <div>Day la san pham {paramCate}</div>
    </>
  );
}
