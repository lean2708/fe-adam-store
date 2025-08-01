import type { TCategory } from "@/types";
import { ControllerFactory } from "./factory-api-client";
import { transformCategoryResponseToTCategory } from "./transform/category";

/**
 * Helper to get an instance of CategoryControllerApi with NextAuth using factory.
 */
async function getCategoryController() {
    return await ControllerFactory.getCategoryController();
}



/**
 * Fetch all categories for user (public).
 */
export async function fetchAllCategoriesApi(page?: number, size?: number, sort?: string[]): Promise<TCategory[]> {
    const api = await getCategoryController();
    const response = await api.fetchAll3({ page, size, sort });
    if (response.data.code !== 200) {
        throw response.data;
    }
    return (response.data.result?.items ?? []).map(transformCategoryResponseToTCategory);
}



/**
 * Create a new category (admin).
 */
export async function createCategoryApi(data: any): Promise<TCategory> {
    const api = await getCategoryController();
    const response = await api.create8({ categoryRequest: data });
    if (response.data.code !== 200) {
        throw response.data;
    }
    if (!response.data.result) throw new Error("No category returned");
    return transformCategoryResponseToTCategory(response.data.result);
}

/**
 * Update a category (admin).
 */
export async function updateCategoryApi(id: number, data: any): Promise<TCategory> {
    const api = await getCategoryController();
    const response = await api.update7({ id, categoryRequest: data });
    if (response.data.code !== 200) {
        throw response.data;
    }
    if (!response.data.result) throw new Error("No category returned");
    return transformCategoryResponseToTCategory(response.data.result);
}

/**
 * Soft delete a category (admin).
 */
export async function deleteCategoryApi(id: number): Promise<TCategory> {
    const api = await getCategoryController();
    const response = await api.delete10({ id });
    if (response.data.code !== 200) {
        throw response.data;
    }
    if (!response.data.result) throw new Error("No category returned");
    return transformCategoryResponseToTCategory(response.data.result);
}

/**
 * Restore a deleted category (admin).
 */
export async function restoreCategoryApi(id: number): Promise<TCategory> {
    const api = await getCategoryController();
    const response = await api.restore4({ id });
    if (response.data.code !== 200) {
        throw response.data;
    }
    if (!response.data.result) throw new Error("No category returned");
    return transformCategoryResponseToTCategory(response.data.result);
}

/**
 * Fetch all categories for admin (admin).
 */
export async function fetchAllCategoriesForAdminApi(page?: number, size?: number, sort?: string[]): Promise<TCategory[]> {
    const api = await getCategoryController();
    const response = await api.fetchAllCategoriesForAdmin({ page, size, sort });
    if (response.data.code !== 200) {
        throw response.data;
    }
    return (response.data.result?.items ?? []).map(transformCategoryResponseToTCategory);
}
