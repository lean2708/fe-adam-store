"use server";
import { fetchAllAddressUserApi } from "@/lib/data/user";
import { TAddress } from "@/types";
export async function getAllAddressUser() {
  try {
    const address= await fetchAllAddressUserApi();
    return {
      status: 200,
      address,
    };
  } catch (error) {
    return {
      status: 500,
      message: "server error",
      error,
    };
  }
}