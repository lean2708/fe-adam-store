'use server';
import {
  createAddressById,
  deleteAddressById,
  fetchAllDistrictById,
  fetchAllProvince,
  fetchAllWardByIdDistrict,
  getAddressById,
  updateAddressById,
} from '@/lib/data/address';
import { fetchAllAddressUserApi } from '@/lib/data/user';
export async function getAllAddressUser() {
  try {
    const address = await fetchAllAddressUserApi();
    return {
      status: 200,
      address,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
export async function fetchProvince() {
  try {
    const provinces = await fetchAllProvince();
    return {
      status: 200,
      provinces,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
export async function fetchDistrictByProvinceId(id: number) {
  try {
    const districts = await fetchAllDistrictById(id);
    return {
      status: 200,
      districts,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
export async function fetchWardByDistrictId(id: number) {
  try {
    const ward = await fetchAllWardByIdDistrict(id);
    return {
      status: 200,
      ward,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
export async function fetchAddressById(id: number) {
  try {
    const address = await getAddressById(id);
    return {
      status: 200,
      address,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
export async function updateAddressByIdAction(
  id: number,
  addressRequest: {
    isDefault: boolean;
    phone: string;
    streetDetail: string;
    wardCode: string;
    districtId: number;
    provinceId: number;
  }
) {
  try {
    const newAddress = await updateAddressById(id, addressRequest);
    return {
      status: 200,
      newAddress,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
export async function createAddressByIdAction(addressRequest: {
  isDefault: boolean;
  phone: string;
  streetDetail: string;
  wardCode: string;
  districtId: number;
  provinceId: number;
}) {
  try {
    const newAddress = await createAddressById(addressRequest);
    return {
      status: 200,
      newAddress,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
export async function deteleAddressById(id: number) {
  try {
    const res = await deleteAddressById(id);
    return {
      status: 200,
      res,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'server error',
      error,
    };
  }
}
