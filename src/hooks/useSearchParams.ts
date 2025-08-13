import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import {
  getSearchParamValue,
  getSearchParamNumber,
  updateSearchParams,
} from "@/lib/searchParams";

interface SearchParamsConfig {
  page: number;
  size: number;
  sort: string;
  categoryId: string;
}

export const useSearchParamsConfig = (): SearchParamsConfig => {
  const searchParams = useSearchParams();

  const config = useMemo((): SearchParamsConfig => {
    return {
      page: getSearchParamNumber(searchParams, "page", 1, 1),
      size: getSearchParamNumber(searchParams, "size", 12, 1, 50),
      sort: getSearchParamValue(searchParams, "sort", "newest"),
      categoryId: getSearchParamValue(searchParams, "categoryId", ""),
    };
  }, [searchParams]);

  return config;
};

export const useUpdateSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (
      updates: Record<string, string | number | undefined>,
      replace: boolean = false
    ) => {
      const newParams = updateSearchParams(searchParams, updates);
      const url = `${pathname}?${newParams}`;

      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router, pathname, searchParams]
  );

  return { updateParams };
};
