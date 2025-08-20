"use client";
import { fetchAllColorsAction } from "@/actions/colorActions";
import { cn } from "@/lib/utils";
import { TColor } from "@/types";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const priceOptions = [
  { id: 1, name: "Dưới 500k" },
  { id: 2, name: "500k - 1 triệu" },
  { id: 3, name: "Trên 1 triệu" },
];
export function SideSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<{
    loading: boolean;
    minPrice?: number;
    colorSort?: number;
    listColor: TColor[];
  }>({
    loading: true,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    colorSort: searchParams.get("color")
      ? Number(searchParams.get("color"))
      : undefined,
    listColor: [],
  });

  useEffect(() => {
    const getColor = async () => {
      try {
        setState((ps) => ({ ...ps, loading: true }));
        const res = await fetchAllColorsAction();
        if (res.success) {
          setState((ps) => ({ ...ps, listColor: res.data || [] }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setState((ps) => ({ ...ps, loading: false }));
      }
    };
    getColor();
  }, []);
  const updateQuery = (key: string, value?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-[15%]">
      <div className="h-14 flex w-full justify-between items-center px-8">
        <p>Bộ lọc</p>
        <span className="text-[#888888]">190 kết quả</span>
      </div>
      <details open={!state.loading} className="group w-full bg-white">
        <summary className="h-14 w-full px-8 border-b border-t border-[#dddddd] outline-none cursor-pointer list-none flex justify-between items-center">
          Màu
          <ChevronRight className="transition-transform group-open:rotate-90" />
        </summary>

        <ul className="w-full px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2 bg-[#F5F5F5]">
          {state.listColor.length !== 0 &&
            !state.loading &&
            state.listColor.map((color: TColor) => (
              <li
                onClick={() => {
                  const newValue =
                    color.id === state.colorSort ? undefined : color.id;
                  setState((ps) => ({ ...ps, colorSort: newValue }));
                  updateQuery("color", newValue);
                }}
                key={color.id}
                className={cn(
                  "flex flex-col items-center px-2 py-2 rounded-md border-1 border-[#00000000]",
                  state.colorSort === color.id &&
                    "border-1 border-[#a0a0a07a] bg-[#acacac31]"
                )}
              >
                <button
                  className="px-6 py-3 rounded-full border-1 border-[#888888]"
                  style={{ backgroundColor: color.name }}
                ></button>
                <span className="select-none mt-1 text-center">
                  {color.name}
                </span>
              </li>
            ))}
        </ul>
      </details>

      <details open className="group w-full bg-white">
        <summary className="h-14 w-full px-8 border-b border-t border-[#dddddd] outline-none cursor-pointer flex justify-between items-center">
          Giá
          <ChevronRight className="transition-transform group-open:rotate-90" />
        </summary>
        <ul className=" bg-[#F5F5F5] text-[#888888] font-bold opacity-0 transition-all duration-500 group-open:min-h-40 group-open:opacity-100">
          {priceOptions.map((item) => (
            <li
              onClick={() => {
                const newValue =
                  item.id === state.minPrice ? undefined : item.id;
                setState((ps) => ({ ...ps, minPrice: newValue }));
                updateQuery("minPrice", newValue);
              }}
              className="flex px-8 py-4 hover:bg-[#ffffffa7] duration-500"
              key={item.id}
            >
              <input
                className="hidden"
                type="checkbox"
                name="price"
                id={String(item.id)}
              />
              <label
                onClick={() => {
                  const newValue =
                    item.id === state.minPrice ? undefined : item.id;
                  setState((ps) => ({ ...ps, minPrice: newValue }));
                  updateQuery("minPrice", newValue);
                }}
                className="flex items-center cursor-pointer"
              >
                <span
                  className={`relative inline-block w-5 h-5 mr-2 border-2 border-[#4b4b4b6e] rounded ${
                    item.id === state.minPrice && "border-black"
                  }`}
                >
                  {item.id === state.minPrice && (
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
                {item.name}
              </label>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
