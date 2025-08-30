import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import PaymentMethodItem from './PaymentMethodItem';
import { PAYMENT_METHODS } from '@/enums';
import { TPaymentMethodOption } from '@/types';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Order.payment_methods');
  return (
    <div className={cn('mb-6', className)}>
      <h3 className='text-primary font-bold mb-4 text-lg'>{t('title')}</h3>

      <RadioGroup
        value={!selectedMethod ? defaultValue : selectedMethod}
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
