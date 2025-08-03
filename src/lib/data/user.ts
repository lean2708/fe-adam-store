import { AddressResponse, UserControllerApi } from "@/api-client";
import { getAuthenticatedAxiosInstance } from "../auth/axios-config";
import { TAddress } from "@/types";

async function getAddressController() {
  const axiosInstance = await getAuthenticatedAxiosInstance();
  return new UserControllerApi(undefined, undefined, axiosInstance);

}
export async function transformAddressResponseToTAddress(apiAdress: AddressResponse): Promise<TAddress> {
  return {
    id: apiAdress.id,
    isDefault: apiAdress.isDefault ?? false,
    isVisible: apiAdress.isVisible,
    status: apiAdress.status,
    phone: apiAdress.phone,
    streetDetail: apiAdress.streetDetail ?? '',

    ward: {
      code: apiAdress.ward?.code,
      name: apiAdress.ward?.name ?? '',
    },

    district: {
      id: apiAdress.district?.id,
      name: apiAdress.district?.name ?? '',
    },

    province: {
      id: apiAdress.province?.id,
      name: apiAdress.province?.name ?? '',
    }
  };
}



export async function fetchAllAddressUserApi(): Promise<TAddress[]> {
  const api = await getAddressController();

  const response = await api.getAddressesByUser();
  const items = response.data.result?.items ?? [];

  return Promise.all(items.map(transformAddressResponseToTAddress));

}

