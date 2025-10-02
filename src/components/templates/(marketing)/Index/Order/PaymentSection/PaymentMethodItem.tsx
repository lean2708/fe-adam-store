import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { PAYMENT_METHODS } from '@/enums';
import { DEFAULT_PAYMENT_METHODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { TPaymentMethodOption } from '@/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback } from 'react';

const PaymentMethodItem = ({
  method,
  isSelected,
  onSelect,
}: {
  method: TPaymentMethodOption;
  isSelected: boolean;
  onSelect: (value: PAYMENT_METHODS) => void;
}) => {
  const handleSelect = useCallback(() => {
    onSelect(method.value);
  }, [method.value, onSelect]);

  const IconComponent = method.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-primary/50',
        isSelected
          ? 'border-2 border-primary '
          : 'border-border hover:bg-muted/30'
      )}
      onClick={handleSelect}
    >
      <RadioGroupItem
        value={method.value}
        id={method.value}
        className={cn(
          'transition-colors',
          isSelected ? 'border-primary text-primary' : 'border-muted-foreground'
        )}
      />

      <Label
        htmlFor={method.value}
        className={cn(
          'flex-1 font-medium cursor-pointer flex items-center gap-3 transition-colors',
          isSelected
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {/* Render icon or image */}
        {IconComponent ? (
          <IconComponent className='size-6 shrink-0' />
        ) : method.image ? (
          <Image
            width={24}
            height={24}
            src={method.image}
            alt={method.label || 'Payment Method'}
            className='size-6 shrink-0 object-contain'
            loading='lazy'
          />
        ) : null}

        <span className='select-none'>{method.label}</span>
      </Label>
    </div>
  );
};

export default PaymentMethodItem;
