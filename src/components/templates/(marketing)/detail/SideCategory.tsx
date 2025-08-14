"use client";

import { getAllCategoriesAction } from "@/actions/categoryActions";
import { TCategory } from "@/types";
import { ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideCategory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramCate = searchParams.get("category");
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategoriesAction();
        if (response.status === 200 && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const handleCheckboxChange = (categoryId: string) => {
    router.push(`?category=${categoryId}`);
  };
  return (
    <aside>
      <h2 className="h-20 w-full text-4xl font-bold flex pl-8 items-center">
        {categories.find((item) => item.id === paramCate)?.title}
        {!paramCate && 'Sản phẩm'}
      </h2>
      <p className="w-full flex px-8 justify-between font-medium h-14 items-center border-b-1 border-[#DDDDDD]">
        <span className="uppercase">Nhóm sản phẩm </span>
        <ChevronRight />
      </p>
      <nav>
        <ul className="bg-[#cccccc4b]">
          {!loading &&
            categories.length > 0 &&
            categories.map((item: TCategory) => (
              <li
                onClick={() => handleCheckboxChange(item.id)}
                className="flex px-8 py-4 hover:bg-[#efefef] duration-500"
                key={item.id}
              >
                <input
                  className="hidden"
                  type="checkbox"
                  name="category"
                  id={item.id}
                  checked={item.id === paramCate}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className="flex items-center cursor-pointer"
                >
                  <span
                    className={`relative inline-block w-5 h-5 mr-2 border-2 border-[#4b4b4b6e] rounded ${
                      item.id === paramCate && "border-black"
                    }`}
                  >
                    {item.id === paramCate && (
                      <svg
                        className="absolute inset-0 w-full h-full bg-black text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  {item.title}
                </label>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}
