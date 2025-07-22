import { del, get, post, put, restore } from "../utils/request";

export const getCategories = async (page = 0, size = 10) => {
  const result = await get(`categories?page=${page}&size=${size}`);
  return result;
}

export const createCategories = async (option) => {
  const result = await post("categories", option);
  return result;
}

export const editCategories = async (id, option) => {
  const result = await put("categories", id, option);
  return result;
}

export const deleteCategories = async (id) => {
  const result = await del("categories", id);
  return result;
}

export const reStoreCategories = async (id) => {
  const result = await restore("categories", id);
  return result;
}
