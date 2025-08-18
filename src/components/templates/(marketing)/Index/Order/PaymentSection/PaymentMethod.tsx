import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import PaymentMethodItem from './PaymentMethodItem';
import { useCallback, useState } from 'react';
import { PAYMENT_METHODS } from '@/lib/constants';

interface Props {
  onPaymentMethodChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

function PaymentMethod({
  onPaymentMethodChange,
  defaultValue = 'vnpay',
  className,
}: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string>(defaultValue);

  const handlePaymentMethodChange = useCallback(
    (value: string) => {
      setSelectedMethod(value);
      onPaymentMethodChange?.(value);
    },
    [onPaymentMethodChange]
  );

  return (
    <div className={cn('mb-6', className)}>
      <h3 className='text-primary font-bold mb-4 text-lg'>
        Phương thức thanh toán
      </h3>

      <RadioGroup
        value={selectedMethod}
        onValueChange={handlePaymentMethodChange}
        className='space-y-3'
      >
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodItem
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.value}
            onSelect={handlePaymentMethodChange}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

export default PaymentMethod;
