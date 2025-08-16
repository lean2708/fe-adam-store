import {
  createAddressByIdAction,
  fetchDistrictByProvinceId,
  fetchProvince,
  fetchWardByDistrictId,
  getAllAddressUser,
} from '@/actions/addressActions';
import { QUERY_KEY_ADDRESS } from '@/lib/constants';
import { addressKeys } from '@/lib/query_key';
import { AddressItem, District, Province, Ward } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Custom hook lấy và quản lý địa chỉ
 */
export default function useAddress() {
  const queryClient = useQueryClient();
  const [currentAddress, setCurrentAddress] = useState<AddressItem | null>(
    null
  );

  // Lấy danh sách địa chỉ của user
  const { data: listAddress = [], isLoading: loading } = useQuery<
    AddressItem[]
  >({
    queryKey: [addressKeys.all],
    queryFn: async () => {
      const response = await getAllAddressUser();
      if (response.status === 200) {
        const items = response.address?.items || [];
        // Auto chọn default address hoặc địa chỉ đầu tiên
        const defaultAddress = items.find((addr) => addr.isDefault);
        setCurrentAddress(defaultAddress || items[0] || null);
        return items;
      }
      setCurrentAddress(null);
      return [];
    },
  });

  // Lấy danh sách địa chỉ của user
  const { data: provinces = [], isLoading: loadingProvinces } = useQuery<
    Province[]
  >({
    queryKey: [QUERY_KEY_ADDRESS.PROVINCES],
    queryFn: async () => {
      const response = await fetchProvince();
      if (response.status === 200) {
        const items = response.provinces?.items || [];

        return items;
      } else {
        console.error(response.error);
        return [];
      }
    },
  });

  // Lấy danh sách địa chỉ của user
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const { data: districts = [], isLoading: loadingDistricts } = useQuery<
    District[]
  >({
    queryKey: [addressKeys.districts(provinceId)],
    queryFn: async () => {
      if (!provinceId) return [];
      const response = await fetchDistrictByProvinceId(provinceId);
      if (response.status === 200) {
        const items = response.districts?.items || [];
        return items;
      } else {
        console.error(response.error);
        return [];
      }
    },
    enabled: !!provinceId, // Chỉ kích hoạt khi có provinceId
    staleTime: 60 * 60 * 1000,
  });

  // Query cho danh sách phường/xã (kích hoạt khi có districtId)
  const [districtId, setDistrictId] = useState<number | null>(null);
  const { data: wards = [], isLoading: loadingWards } = useQuery<Ward[]>({
    queryKey: [addressKeys.wards(districtId)],
    queryFn: async () => {
      if (!districtId) return [];
      const response = await fetchWardByDistrictId(districtId);
      if (response.status === 200) {
        const items = response.ward?.items || [];
        return items;
      } else {
        console.error(response.error);
        return [];
      }
    },
    enabled: !!districtId, // Chỉ kích hoạt khi có districtId
    staleTime: 60 * 60 * 1000,
  });

  // Thêm địa chỉ mới
  const { mutate: addNewAddress, isPending: isPendingAddNewAddress } =
    useMutation({
      mutationFn: async (newAddress: {
        isDefault: boolean;
        phone: string;
        streetDetail: string;
        wardCode: string;
        districtId: number;
        provinceId: number;
      }) => createAddressByIdAction(newAddress),

      onSuccess: (response, variables) => {
        if (response.status === 200 && response.newAddress) {
          // Cập nhật currentAddress nếu là default
          if (variables.isDefault) {
            setCurrentAddress(response.newAddress);
          }
          // Làm mới lại danh sách với object form
          queryClient.invalidateQueries({
            queryKey: [addressKeys.all],
          });
        }
      },
    });

  // Hàm để thiết lập provinceId (kích hoạt fetch districts)
  const setSelectedProvince = (id: number | null) => {
    setProvinceId(id);
    setDistrictId(null); // Reset district khi thay đổi province
  };

  // Hàm để thiết lập districtId (kích hoạt fetch wards)
  const setSelectedDistrict = (id: number | null) => {
    setDistrictId(id);
  };

  // API expose ra ngoài
  return {
    currentAddress,
    setCurrentAddress,
    loading,
    listAddress,
    addNewAddress,
    isPendingAddNewAddress,

    // Address data
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,

    // Hàm để thiết lập ID cho các query phụ thuộc
    setSelectedProvince,
    setSelectedDistrict,
  };
}
