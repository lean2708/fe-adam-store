import type { CategoryResponse } from "@/api-client/models";
import { TCategory } from "@/types";

/**
 * Transform API CategoryResponse to TCategory.
 */
export function transformCategoryResponseToTCategory(apiCategory: CategoryResponse): TCategory {
    return {
        id: apiCategory.id?.toString() ?? "",
        title: apiCategory.name ?? "",
        image: "",
    };
}
