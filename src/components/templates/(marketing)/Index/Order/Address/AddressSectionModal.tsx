import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TAddressItem } from '@/types';
import { toast } from 'sonner';
import ConfirmDialogModule from '@/components/modules/ConfirmDialogModule';
import { Card, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function AddressSectionModal(props: {
  visible: boolean;
  addressList: TAddressItem[];
  currentAddressId?: number;
  onClose: () => void;
  onSelectAddress: (address: TAddressItem) => void;
  onAddNewAddress: () => void;
}) {
  const {
    visible,
    onClose,
    addressList,
    currentAddressId,
    onSelectAddress,
    onAddNewAddress,
  } = props;

  const t = useTranslations('Profile.address');

  const [selectedAddressId, setSelectedAddressId] = useState<
    number | undefined
  >(currentAddressId);
  const [pendingAddressId, setPendingAddressId] = useState<
    number | undefined
  >();
  const [isSubmit, setIsSubmit] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setSelectedAddressId(currentAddressId);
    setPendingAddressId(undefined); // clear temporary
  }, [currentAddressId]);

  const handleRadioClick = (addressId: number) => {
    setPendingAddressId(addressId);
    setConfirm(true);
  };

  const handleConfirmSelect = () => {
    try {
      const selectedAddress = addressList.find(
        (addr) => addr.id === pendingAddressId
      );
      if (selectedAddress) {
        setIsSubmit(true);
        setSelectedAddressId(pendingAddressId);
        onSelectAddress(selectedAddress);
      }
      onClose();
    } catch (error) {
      toast.error(t('failed.message_select'));
      onClose();
    } finally {
      setConfirm(false);
      setIsSubmit(false);
      setPendingAddressId(undefined);
    }
  };

  if (!visible) return null;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      )}
      onClick={onClose}
    >
      <Card
        className='relative w-full adam-store-bg-light rounded-xl shadow-lg max-w-[calc(100%-2rem)] sm:max-w-lg'
        onClick={stopPropagation}
      >
        <div className='!flex w-full justify-center items-center h-20 mt-2'>
          <div className='h-14 w-full flex flex-col items-center justify-between'>
            <CardTitle className='!text-2xl !font-bold'>
              {t('choose.title')}
            </CardTitle>
            <p className='text-muted-foreground'>{t('choose.description')}</p>
          </div>
          <button
            onClick={onClose}
            className='absolute right-6 top-7 w-auto h-auto rounded-full'
          >
            <CircleX size={30} />
          </button>
        </div>
        {/* Body */}
        <div className='pb-6 px-6 max-h-[60vh] overflow-y-auto'>
          <RadioGroup
            value={selectedAddressId?.toString()}
            className='space-y-3 mt-4'
          >
            {addressList.length === 0 ? (
              <div className='text-center py-4'>{t('no_address')}</div>
            ) : (
              addressList.map((item: TAddressItem) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center space-x-3 p-4 rounded-lg border relative',
                    selectedAddressId === item.id
                      ? 'border-primary ring-2 ring-primary ring-opacity-50'
                      : 'border-gray-300'
                  )}
                >
                  <RadioGroupItem
                    value={item.id?.toString() || '0'}
                    id={`address-${item.id}`}
                    checked={selectedAddressId === item.id}
                    onClick={() => handleRadioClick(item.id || 0)}
                    tabIndex={0}
                    aria-checked={selectedAddressId === item.id}
                    className={cn(
                      'mt-1 size-6 ',
                      selectedAddressId === item.id ? 'ring-2 ' : ''
                    )}
                  />
                  <Label
                    htmlFor={`address-${item.id}`}
                    className='flex-1 cursor-pointer leading-normal my-1'
                    onClick={() => handleRadioClick(item.id || 0)}
                  >
                    <div className='text-left'>
                      <p
                        className={cn(
                          'font-medium',
                          !item.isDefault && 'text-gray-600'
                        )}
                      >
                        (+84) {item.phone}
                      </p>
                      <p
                        className={cn(
                          'font-medium mt-1',
                          !item.isDefault && 'text-gray-600'
                        )}
                      >
                        {item.streetDetail}, {item.ward?.name},{' '}
                        {item.district?.name}, {item.province?.name}
                      </p>
                      {item.isDefault && (
                        <span className='absolute -top-3 left-5 px-2 py-0.5 adam-store-bg-light z-50'>
                          {t('set_default.title')}
                        </span>
                      )}
                    </div>
                  </Label>
                </div>
              ))
            )}
          </RadioGroup>
          <Button
            variant={'outline'}
            onClick={() => {
              onClose();
              onAddNewAddress();
            }}
            className='h-14 w-full mt-3 flex justify-center items-center rounded-lg font-medium cursor-pointer'
          >
            {t('add_address')}
          </Button>
        </div>

        <ConfirmDialogModule
          loading={isSubmit}
          onClose={() => {
            setConfirm(false);
            setPendingAddressId(undefined);
          }}
          title={t('action.confirm_change')}
          onSubmit={handleConfirmSelect}
          confirm={confirm}
        />
      </Card>
    </div>
  );
}
