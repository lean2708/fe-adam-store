"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  PageResponseSizeResponse
} from "@/api-client/models";
import {
  fetchAllSizes
} from "@/lib/data/size";
import { TSize } from "@/types";

/**
 * Fetch all sizes
 */
export async function fetchAllSizesAction(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,asc"]
): Promise<ActionResponse<TSize[]>> {
  try {
    const data = await fetchAllSizes(page, size, sort);
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch sizes",
    };
  }
}
