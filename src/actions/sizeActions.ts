"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type { 
  PageResponseSizeResponse
} from "@/api-client/models";
import {
  fetchAllSizes
} from "@/lib/data/size";

/**
 * Fetch all sizes
 */
export async function fetchAllSizesAction(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,asc"]
): Promise<ActionResponse<PageResponseSizeResponse>> {
  try {
    const data = await fetchAllSizes(page, size, sort);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch sizes",
    };
  }
}
