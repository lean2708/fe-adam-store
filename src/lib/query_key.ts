import { QUERY_KEY_ADDRESS } from './constants';

export const addressKeys = {
  all: [QUERY_KEY_ADDRESS],
  districts: (provinceId: number | null) => [
    QUERY_KEY_ADDRESS.DISTRICTS,
    provinceId,
  ],
  wards: (districtId: number | null) => [QUERY_KEY_ADDRESS.WARDS, districtId],
};
