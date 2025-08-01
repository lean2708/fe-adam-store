import { UserControllerApi } from "@/api-client";
import { getAuthenticatedAxiosInstance } from "../auth/axios-config";

async function getAddressController() {
  const axiosInstance = await getAuthenticatedAxiosInstance();
  return new UserControllerApi(undefined, undefined, axiosInstance);

}

export async function fetchAllAddressUserApi() {
  const api = await getAddressController();

  const response =await api.getAddressesByUser();
  return response.data.result;
}