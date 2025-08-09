import { ControllerFactory } from "./factory-api-client";
import type {
  UserResponse,
  UserCreationRequest,
  UserUpdateRequest,
  PageResponseUserResponse,
  PageResponseRoleResponse
} from "@/api-client/models";

// Legacy function - keeping for backward compatibility
export async function fetchAllProvince() {
  const api = await ControllerFactory.getProvinceController();
  const response = await api.fetchAll6({ size: 63 })
  return response.data.result;
}
export async function fetchAllDistrictById(id: number) {
  const api = await ControllerFactory.getProvinceController();
  const response = await api.fetchDistrictsByProvince({ provinceId: id, size: 20 })
  return response.data.result;
}
export async function fetchAllWardByIdDistrict(id: number) {
  const api = await ControllerFactory.getDistrictController();
  const response = await api.fetchWardsByDistrict({ districtId: id, size: 30 })
  return response.data.result;
}
export async function getAddressById(id: number) {
  const api = await ControllerFactory.getAddressController();
  const response = await api.fetchById7({ id: id })
  return response.data.result;
}
export async function updateAddressById(
  id: number,
  addressRequest: {
    isDefault: boolean,
    phone: string,
    streetDetail: string,
    wardCode: string,
    districtId: number,
    provinceId: number
  }
) {
  const api = await ControllerFactory.getAddressController();
  const response = await api.update3({
    id: id,
    addressRequest: addressRequest
  })
  return response.data.result;
}
export async function createAddressById(
  addressRequest: {
    isDefault: boolean,
    phone: string,
    streetDetail: string,
    wardCode: string,
    districtId: number,
    provinceId: number
  }
) {
  const api = await ControllerFactory.getAddressController();
  const response = await api.create3({
    addressRequest: addressRequest
  })
  return response.data.result;
}
export async function deleteAddressById(
  id: number
) {
  const api = await ControllerFactory.getAddressController();
  const response = await api.delete12({
    id: id
  })
  return response.data.result;
}