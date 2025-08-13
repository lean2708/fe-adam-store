import { getAllAddressUser } from '@/actions/addressActions';
import { AddressItem } from '@/types';
import { useState, useEffect } from 'react';

export default function useDeliveryInfo() {
  const [currentAddress, setCurrentAddress] = useState<AddressItem | null>(
    null
  );
  const [listAddress, setListAddress] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddressUser = async () => {
      try {
        setLoading(true);
        const response = await getAllAddressUser();

        if (response.status === 200) {
          const items = response.address?.items || [];
          setListAddress(items);

          // Find the default address
          const defaultAddress = items.find((addr) => addr.isDefault);
          const firstAddress = items[0];
          const addressToShow = defaultAddress || firstAddress;

          setCurrentAddress(addressToShow || null);
        } else {
          setCurrentAddress(null);
          setListAddress([]);
        }
      } catch (error) {
        console.error('Failed to fetch address:', error);
        setCurrentAddress(null);
        setListAddress([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddressUser();
  }, []);

  return { currentAddress, listAddress, loading, setCurrentAddress };
}
