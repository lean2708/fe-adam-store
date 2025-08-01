import { UserControllerApi } from "@/api-client";
import { getAuthConfiguration } from "@/api-client/init-auth-config";

async function getAddressController() {
  return new UserControllerApi(await getAuthConfiguration());
}
export async function fetchAllAddressUserApi() {
  const api = new UserControllerApi(await getAuthConfiguration());
  const response =await api.getAddressesByUser();
  return response.data.result;
}