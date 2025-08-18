import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import PaymentMethodItem from './PaymentMethodItem';
import { useCallback, useState } from 'react';
import { DEFAULT_PAYMENT_METHODS } from '@/lib/constants';
import { PAYMENT_METHODS } from '@/enums';
import { TPaymentMethodOption } from '@/types';

interface Props {
  onPaymentMethodChange: (value: PAYMENT_METHODS) => void;
  selectedMethod: PAYMENT_METHODS;
  defaultValue?: string;
  availableMethods: TPaymentMethodOption[];
  className?: string;
}

function PaymentMethod({
  onPaymentMethodChange,
  selectedMethod,
  defaultValue = PAYMENT_METHODS.CASH,
  availableMethods,
  className,
}: Props) {
  return (
    <div className={cn('mb-6', className)}>
      <h3 className='text-primary font-bold mb-4 text-lg'>
        Phương thức thanh toán
      </h3>

      <RadioGroup
        value={selectedMethod || defaultValue}
        onValueChange={(value: PAYMENT_METHODS) => onPaymentMethodChange(value)}
        className='space-y-3'
      >
        {availableMethods.map((method) => (
          <PaymentMethodItem
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.value}
            onSelect={onPaymentMethodChange}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

export default PaymentMethod;
