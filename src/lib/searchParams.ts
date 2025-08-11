import { ReadonlyURLSearchParams } from "next/navigation";

export const createSearchParams = (
  params: Record<string, string | number | undefined>
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
};

export const updateSearchParams = (
  currentParams: ReadonlyURLSearchParams,
  updates: Record<string, string | number | undefined>
) => {
  const newParams = new URLSearchParams(currentParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
  });

  return newParams.toString();
};

export const getSearchParamValue = (
  searchParams: ReadonlyURLSearchParams,
  key: string,
  defaultValue: string = ""
): string => {
  return searchParams.get(key) || defaultValue;
};

export const getSearchParamNumber = (
  searchParams: ReadonlyURLSearchParams,
  key: string,
  defaultValue: number,
  min?: number,
  max?: number
): number => {
  const value = parseInt(searchParams.get(key) || String(defaultValue));
  if (isNaN(value)) return defaultValue;

  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;

  return value;
};
