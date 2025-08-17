import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCallback } from 'react';
import { PaymentMethodOption } from './PaymentMethod';

const PaymentMethodItem = ({
  method,
  isSelected,
  onSelect,
}: {
  method: PaymentMethodOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
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
            alt={method.label}
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
